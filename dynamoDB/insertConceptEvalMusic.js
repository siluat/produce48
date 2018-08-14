const fs = require('fs');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-2'
});

const DB_TABLE_NAME = 'produce48concept';
const FILE_PATH = './data/conceptEvalMusic.json';

console.info('콘셉트 평가 음원 기본 정보 초기화 시작!');

const items = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

items.forEach(item => {
  store(item);
});

console.info('콘셉트 평가 음원 기본 정보 초기화 완료!');

function store(item) {
  const params = {
    TableName: DB_TABLE_NAME,
    Item: item,
  };

  console.info('Store ' + item.title + '\'s data...');

  documentClient.put(params, (err) => {
    if (err) {
      console.error(err);
      console.error(params);
      process.exit();
    }
  });
};
