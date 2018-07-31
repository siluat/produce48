/**
 * 공식 홈페이지 연습생 ID와 국프의 정원 연습생 ID 연결
 */

const fs = require('fs');
const puppeteer = require('puppeteer');
const _ = require('lodash');

const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'ap-northeast-2'});

const DB_TABLE_NAME = 'produce48';
const FILE_PATH = './data/gardenIndex.json';

const getGardenUrl = idx => {
  return 'https://produce48.kr/m48_detail.php?idx=' + idx + '&cate=hug';
}

console.info('국프의 정원 연습생 IDX 정보 업데이트 시작!');

const trainees = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let idx = 1; idx <= 96; idx++) {
    let url = getGardenUrl(idx);

    await page.goto(url);

    const primeSelector = '#my_hug_';
    await page.waitForSelector(primeSelector);

    const name = await page.evaluate(getName);
    
    const id = _.find(trainees, { 'name': name }).id;

    store({
      id,
      name,
      idx
    });
  }

  await browser.close();

  console.info('국프의 정원 연습생 IDX 정보 업데이트 완료!');
})();

const getName = () => {
  const selector = [
    '#my_hug_',
    'h3',
    'span'
  ].join(' ');
  return document.querySelector(selector).textContent;
};

function store(item) {
  const params = {
    TableName: DB_TABLE_NAME,
    Key: {
      id: item.id
    },
    UpdateExpression: 'set gardenIdx = :gi',
    ExpressionAttributeValues: {
      ':gi': item.idx
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