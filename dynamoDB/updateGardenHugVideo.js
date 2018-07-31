const fs = require('fs');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-2'
});

const DB_TABLE_NAME = 'produce48';
const FILE_PATH = './data/gardenHugVideo.json';

console.info('국프의 정원 단계별 인증 영상 주소 업데이트 시작!');

const items = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

items.forEach(item => {

  if (!item.first) {
    return;
  }

  let toStore = {
    id: item.id,
    first: item.first || null,
    second: item.second || null,
    third: item.third || null,
    fourth: item.fourth || null,
    fifth: item.fifth || null
  }

  store(toStore);
});

console.info('국프의 정원 단계별 인증 영상 주소 업데이트 완료!');

function store(item) {

  const updateExpression = [];

  if (item.first) {
    updateExpression.push('set gardenHugFirstVideo = :first');
  }

  if (item.second) {
    updateExpression.push('gardenHugSecondVideo = :second');
  }



  const params = {
    TableName: DB_TABLE_NAME,
    Key: {
      id: item.id
    },
    UpdateExpression: updateExpression.join(', '),
    ExpressionAttributeValues: {
      ':first': item.first,
      ':second': item.second,
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
