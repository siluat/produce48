const puppeteer = require('puppeteer');
const moment = require('moment');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'ap-northeast-2'});
const sns = new AWS.SNS({region: 'ap-northeast-2'});

const DB_TABLE_NAME = 'produce48concept';
const AWS_SNS_TARGET_ARN = 'arn:aws:sns:ap-northeast-2:876863305772:toSlack';
const CHART_1_50_URL = 'https://music.naver.com/listen/top100.nhn?domain=TOTAL';
const CHART_51_100_URL = 'https://music.naver.com/listen/top100.nhn?domain=TOTAL&page=2';

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
  console.info('네이버 차트 크롤링 시작!');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 1 to 50
  await page.goto(CHART_1_50_URL,  {waitUntil: 'networkidle2'});
  const primeSelector = '.tracklist_table';
  await page.waitForSelector(primeSelector);
  let titleList = await page.evaluate(getTitleList);
  let artistList = await page.evaluate(getArtistList);

  await page.goto(CHART_51_100_URL,  {waitUntil: 'networkidle2'});
  await page.waitForSelector(primeSelector);
  titleList = titleList.concat(await page.evaluate(getTitleList));
  artistList = artistList.concat(await page.evaluate(getArtistList));


  items.forEach(item => {
    const title = item.title;
    const artist = item.artist;

    const titleIndex = titleList.indexOf(title);

    let rank = 0;

    if (titleIndex > 0 && artistList[titleIndex] === artist) {
      rank = titleIndex + 1;
    }

    let bestRank = 0;

    if (rank > 0 && (rank < bestRank || bestRank === 0)) {
      bestRank = rank;
    }

    console.log(title, rank, bestRank);

    store({
      id: item.id,
      title: item.title,
      rank: rank,
      bestRank: bestRank
    });
  });

  await browser.close();

  await reportComplete();

  console.info('네이버 차트 크롤링 완료!');
};

const getTitleList = () => {
  const selector = '._title .ellipsis';
  const titleList = [];
  document.querySelectorAll(selector).forEach(e => { 
    titleList.push(e.textContent.trim());
  });
  return titleList;
};

const getArtistList = () => {
  const selector = '._artist .ellipsis';
  const artistList = [];
  document.querySelectorAll(selector).forEach(e => { 
    artistList.push(e.textContent.trim());
  });
  return artistList;
};

function store(item) {
  let updateExpression = 'set naverRank = :r';
  let expressionAttributeValues = {
    ':r': item.rank
  }

  if (item.bestRank > 0) {
    updateExpression += ', naverBestRank =: b, naverBestRankTime =: t';
    expressionAttributeValues[':b'] = item.bestRank;
    expressionAttributeValues[':t'] = moment().format();
  }

  console.log(updateExpression, expressionAttributeValues);

  const params = {
    TableName: DB_TABLE_NAME,
    Key: {
      id: item.id
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues
  };

  console.info('Store ' + item.title + '\'s data...');

  documentClient.update(params, (err) => {
    if (err) {
      console.error(err);
      console.error(params);
      process.exit();
    }
  });
};

const reportComplete = async () => {
  var message = '네이버 차트 정보를 업데이트 했습니다.';

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