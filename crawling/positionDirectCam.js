const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-2'
});

const DB_TABLE_NAME = 'produce48';

const params = {
  TableName : DB_TABLE_NAME,
};


documentClient.scan(params, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    crawling(data.Items);
  }
});

const crawling = async items => {
  console.info('포지션 평가 반응 크롤링 시작!');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let i = 0; i < items.length; i++) {
    let item = items[i];

    if (!item.positionDirectCamUrl || !item.positionDirectCamUrl.length) {
      continue;
    }

    await page.goto(item.positionDirectCamUrl,  {waitUntil: 'networkidle2'});

    const primeSelector = '.u_cnt._cnt';
    await page.waitForSelector(primeSelector);

    const likeCount = await page.evaluate(getLikeCount);
    const viewCount = await page.evaluate(getViewCount);
    const commentCount = await page.evaluate(getCommentCount);

    store({
      id: item.id,
      name: item.name,
      view: viewCount,
      like: likeCount,
      comment: commentCount
    });

    await page.waitFor(1000);
  }

  await browser.close();

  console.info('포지션 평가 반응 크롤링 완료!');
};

const getLikeCount = () => {
  const selector = '.u_cnt._cnt';
  let count = document.querySelector(selector).innerText;
  return parseInt(count.replace(/,/g, ''));
};

const getViewCount = () => {
  const selector = '.title_info .play';
  let count = document.querySelector(selector).innerText;
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
    UpdateExpression: 'set positionLike = :pl',
    ExpressionAttributeValues: {
      ':pl': item.like
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