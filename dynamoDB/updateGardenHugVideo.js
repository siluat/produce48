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
  const expressionAttributeValues = {};

  if (item.first) {
    updateExpression.push('set gardenHugFirstVideo = :first');
    expressionAttributeValues[':first'] = item.first;
  }

  if (item.second) {
    updateExpression.push('gardenHugSecondVideo = :second');
    expressionAttributeValues[':second'] = item.second;
  }

  if (item.third) {
    updateExpression.push('gardenHugThirdVideo = :third');
    expressionAttributeValues[':third'] = item.third;
  }

  if (item.fourth) {
    updateExpression.push('gardenHugFourthVideo = :fourth');
    expressionAttributeValues[':fourth'] = item.fourth;
  }

  if (item.fifth) {
    updateExpression.push('gardenHugFifthVideo = :fifth');
    expressionAttributeValues[':fifth'] = item.fifth;
  }

  if (!updateExpression.length) {
    return;
  }

  const params = {
    TableName: DB_TABLE_NAME,
    Key: {
      id: item.id
    },
    UpdateExpression: updateExpression.join(', '),
    ExpressionAttributeValues: expressionAttributeValues
  };

  documentClient.update(params, (err, data) => {
    if (err) {
      console.error(err);
      console.error(params);
      process.exit();
    }
  });
};
