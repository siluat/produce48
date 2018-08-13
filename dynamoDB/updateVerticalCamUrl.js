const fs = require('fs');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-2'
});

const DB_TABLE_NAME = 'produce48';
const FILE_PATH = './data/verticalCamUrl.json';

console.info('30 연습생 세로캠 주소 업데이트 시작!');

const items = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

items.forEach(item => {
  if (item.twitter.length) {
    store(item);
  }
});

console.info('30 연습생 세로캠 주소 업데이트 완료!');

function store(item) {
  const params = {
    TableName: DB_TABLE_NAME,
    Key: {
      id: item.id
    },
    UpdateExpression: 'set verticalCamTwitterUrl = :t, verticalCamFacebookUrl = :f',
    ExpressionAttributeValues: {
      ':t': item.twitter,
      ':f': item.facebook
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
