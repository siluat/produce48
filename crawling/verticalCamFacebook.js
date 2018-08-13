const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'ap-northeast-2'});
const sns = new AWS.SNS({region: 'ap-northeast-2'});

const DB_TABLE_NAME = 'produce48';
const AWS_SNS_TARGET_ARN = 'arn:aws:sns:ap-northeast-2:876863305772:toSlack';

const params = {
  TableName : DB_TABLE_NAME,
};

const ID = {
  login: '#email',
  pass: '#pass'
};

const sleep = async (ms) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, ms)
  });
}

documentClient.scan(params, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    crawling(data.Items);
  }
});

const crawling = async items => {
  console.info('세로캠 페이스북 반응 크롤링 시작!');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(items[0].verticalCamFacebookUrl,  {waitUntil: 'networkidle2'});
  await page.waitForSelector(ID.login);
  await page.type(ID.login, 'siluat@gmail.com');
  await page.type(ID.pass, '#silu@2276');
  await sleep(500);
  await page.click("#loginbutton");
  await page.waitForNavigation();

  for (let i = 0; i < items.length; i++) {
    let item = items[i];

    if (!item.verticalCamFacebookUrl || !item.verticalCamFacebookUrl.length) {
      continue;
    }

    await page.goto(item.verticalCamFacebookUrl,  {waitUntil: 'networkidle2'});
    
    const primeSelector = 'a[data-testid="ufi_bling_token_1"] span:nth-child(2)';
    await page.waitForSelector(primeSelector);

    const likeCount = await page.evaluate(getLikeCount);
    const heartCount = await page.evaluate(getHeartCount);
    // const viewCount = await page.evaluate(getViewCount);
    // const commentCount = await page.evaluate(getCommentCount);

    console.log(item.name, likeCount, heartCount);

    store({
      id: item.id,
      name: item.name,
      // view: viewCount,
      like: likeCount,
      heart: heartCount,
      // comment: commentCount
    });
  }

  await browser.close();

  await reportComplete();

  console.info('세로캠 페이스북 반응 크롤링 완료!');
};

const getLikeCount = () => {
  const selector = 'a[data-testid="ufi_bling_token_1"] span:nth-child(2)';
  let count = document.querySelector(selector).textContent;
  return parseInt(count.replace(/,/g, ''));
};

const getHeartCount = () => {
  const selector = 'a[data-testid="ufi_bling_token_2"] span:nth-child(2)';
  let count = document.querySelector(selector).textContent;
  return parseInt(count.replace(/,/g, ''));
};

const getCommentCount = () => {
  const selector = '._commentCount';
  let count = document.querySelector(selector).innerText;
  return parseInt(count.replace(/,/g, ''));
};

function store(item) {
  const params = {
    TableName: DB_TABLE_NAME,
    Key: {
      id: item.id
    },
    UpdateExpression: 'set verticalCamFacebookLike = :l, verticalCamFacebookHeart = :h',
    ExpressionAttributeValues: {
      // ':v': item.view,
      ':l': item.like,
      ':h': item.heart,
      // ':c': item.comment
    }
  };

  console.info('Store ' + item.name + '\'s data...');

  documentClient.update(params, (err, data) => {
    if (err) {
      console.error(err);
      console.error(params);
      process.exit();
    }
  });
};

const reportComplete = async () => {
  var message = '프로듀스48 30 연습생 세로캠 영상 페이스북 관련 정보를 업데이트 했습니다.';

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