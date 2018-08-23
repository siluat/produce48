const fs = require('fs');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-2'
});

const DB_TABLE_NAME = 'produce48concept';
const FILE_PATH = './data/conceptMusicChartLabel.json';

console.info('콘셉트 평가 음원 정식 텍스트 업데이트 시작!');

const items = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

items.forEach(item => {
  if (item.title.length) {
    store(item);
  }
});

console.info('콘셉트 평가 음원 정식 텍스트 업데이트 완료!');

function store(item) {
  const params = {
    TableName: DB_TABLE_NAME,
    Key: {
      id: item.id
    },
    UpdateExpression: 'set title = :t, titleInKorean = :k, melonTitle = :mt, genieTitle = :gt, artist = :a',
    ExpressionAttributeValues: {
      ':t': item.title,
      ':k': item.titleInKorean,
      ':mt': item.melonTitle,
      ':gt': item.genieTitle,
      ':a': item.artist
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
