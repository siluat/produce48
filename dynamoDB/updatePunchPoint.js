const fs = require('fs');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-2'
});

const DB_TABLE_NAME = 'produce48';
const FILE_PATH = './data/punchPoint.json';

console.info('펀치퀸 점수 업데이트 시작!');

const items = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

items.forEach(item => {
  if (typeof item.reference === 'number') {
    store(item);
  }
});

console.info('펀치퀸 점수 업데이트 완료!');

function store(item) {
  let updateExpression = 'set punchPoint = :p';
  let expressionAttributeValues = {
    ':p': item.reference
  };

  if (item.punchName) {
    updateExpression += ', punchName = :n';
    expressionAttributeValues[':n'] = item.punchName;
  }

  const params = {
    TableName: DB_TABLE_NAME,
    Key: {
      id: item.id
    },
    UpdateExpression: updateExpression,
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
