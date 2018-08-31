const fs = require('fs');
const puppeteer = require('puppeteer');
const _ = require('lodash');

const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'ap-northeast-2'});

const URL = 'http://produce48.mnet.com/pc/rank/8';
const DB_TABLE_NAME = 'produce48';
const FILE_PATH = './data/retired.json';

console.info('12주차 순위 업데이트 시작!');

const trainees = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(URL);

  const primeSelector = '.rank1to11';
  await page.waitForSelector(primeSelector);

  let rank = 1;

  const nameOf1to12 = await page.evaluate(getNameOf1to12);
  nameOf1to12.forEach(name => {
    const id = _.find(trainees, { 'name': name }).id;
    
    console.log(id, name, rank);

    store({
      id,
      name,
      rank
    });

    rank++;
  });

  const nameOf13to30 = await page.evaluate(getNameOf13to30);
  nameOf13to30.forEach(name => {
    const id = _.find(trainees, { 'name': name }).id;
    
    console.log(id, name, rank);

    store({
      id,
      name,
      rank
    });

    rank++;
  });

  await browser.close();

  console.info('12주차 순위 업데이트 완료!');
})();

const getNameOf1to12 = () => {
  const list = [];

  document.querySelectorAll('.rank1to11 li p a').forEach(li => {
    list.push(li.textContent);
  });

  return list;
};

const getNameOf13to30 = () => {
  const list = [];

  document.querySelectorAll('ol[olno="1"] li p a').forEach(li => {
    list.push(li.textContent);
  });

  return list;
};

function store(item) {
  const params = {
    TableName: DB_TABLE_NAME,
    Key: {
      id: item.id
    },
    UpdateExpression: 'set week12Rank = :r',
    ExpressionAttributeValues: {
      ':r': item.rank
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
