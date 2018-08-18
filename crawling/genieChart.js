const puppeteer = require('puppeteer');
const moment = require('moment');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'ap-northeast-2'});
const sns = new AWS.SNS({region: 'ap-northeast-2'});

const DB_TABLE_NAME = 'produce48concept';
const AWS_SNS_TARGET_ARN = 'arn:aws:sns:ap-northeast-2:876863305772:toSlack';
const CHART_1_50_URL = 'http://www.genie.co.kr/chart/top200';
const CHART_51_100_URL = 'http://www.genie.co.kr/chart/top200?ditc=D&rtm=Y&pg=2';

const params = {
  TableName : DB_TABLE_NAME,
};

process.on('unhandledRejection', error => {
  const message = '[ERROR][지니 차트] ' + error.message;

  const params = {
    Message: message,
    TargetArn: AWS_SNS_TARGET_ARN
  };

  sns.publish(params, (err, data) => {
    if (err)  console.log(err, err.stack);
    else      console.log(data);

    process.exit();
  });
});

documentClient.scan(params, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    crawling(data.Items);
  }
});

const crawling = async items => {
  console.info('지니 차트 크롤링 시작!');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(CHART_1_50_URL,  {waitUntil: 'networkidle2'});
  const primeSelector = '.list-wrap';
  await page.waitForSelector(primeSelector);
  let titleList = await page.evaluate(getTitleList);
  let artistList = await page.evaluate(getArtistList);

  await page.goto(CHART_51_100_URL,  {waitUntil: 'networkidle2'});
  await page.waitForSelector(primeSelector);
  titleList = titleList.concat(await page.evaluate(getTitleList));
  artistList = artistList.concat(await page.evaluate(getArtistList));


  items.forEach(item => {
    const title = item.genieTitle;
    const artist = item.artist;

    const titleIndex = titleList.indexOf(title);

    let rank = 0;

    if (titleIndex > 0 && artistList[titleIndex] === artist) {
      rank = titleIndex + 1;
    }

    let bestRank = item.genieBestRank || 0;
    let bestRankTime = item.genieBestRankTime || 0;

    if (rank > 0 && (rank < bestRank || bestRank === 0)) {
      bestRank = rank;
      bestRankTime = moment().format();
    }

    console.log(title, rank, bestRank);

    store({
      id: item.id,
      title: item.title,
      rank: rank,
      bestRank: bestRank,
      bestRankTime: bestRankTime
    });
  });

  await browser.close();

  await reportComplete();

  console.info('지니 차트 크롤링 완료!');
};

const getTitleList = () => {
  const selector = '.title.ellipsis';
  const titleList = [];
  document.querySelectorAll(selector).forEach(e => { 
    titleList.push(e.textContent.trim());
  });
  return titleList;
};

const getArtistList = () => {
  const selector = '.info .artist.ellipsis';
  const artistList = [];
  document.querySelectorAll(selector).forEach(e => { 
    artistList.push(e.textContent.trim());
  });
  return artistList;
};

function store(item) {
  let updateExpression = 'set genieRank = :r';
  let expressionAttributeValues = {
    ':r': item.rank
  }

  if (item.bestRank > 0) {
    updateExpression += ', genieBestRank = :b, genieBestRankTime = :t';
    expressionAttributeValues[':b'] = item.bestRank;
    expressionAttributeValues[':t'] = item.bestRankTime;
  }

  const params = {
    TableName: DB_TABLE_NAME,
    Key: {
      id: item.id
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues
  };

  documentClient.update(params, (err) => {
    if (err) {
      console.error(err);
      console.error(params);
      process.exit();
    }
  });
};

const reportComplete = async () => {
  var message = '지니 차트 정보를 업데이트 했습니다.';

  var params = {
    Message: message,
    TargetArn: AWS_SNS_TARGET_ARN
  };

  for (var i = 0; i < 1; i++) {
    sns.publish(params, function(err, data) {
      if (err)  console.log(err, err.stack);
      else      console.log(data);
    });
  }
};