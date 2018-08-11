const fs = require('fs');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-2'
});

const DB_TABLE_NAME = 'produce48';
const FILE_PATH = './data/specialClipUrl.json';

console.info('30 연습생 스페셜 클립 주소 업데이트 시작!');

const items = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

items.forEach(item => {
  if (item.reference.length) {
    store(item);
  }
});

console.info('30 연습생 스페셜 클립 주소 업데이트 완료!');

function store(item) {
  const params = {
    TableName: DB_TABLE_NAME,
    Key: {
      id: item.id
    },
    UpdateExpression: 'set specialClipUrl = :n, specialClipTwitterUrl = :t, specialClipInstaUrl = :i',
    ExpressionAttributeValues: {
      ':n': item.reference,
      ':t': item.twitter,
      ':i': item.insta
    }
  };

  documentClient.update(params, (err, data) => {
    if (err) {
      console.error(err);
      console.error(params);
      process.exit();
    }
  });
};
