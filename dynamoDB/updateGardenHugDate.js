const fs = require('fs');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-2'
});

const DB_TABLE_NAME = 'produce48';
const FILE_PATH = './data/gardenHugDate.json';

console.info('국프의 정원 단계별 시간 기록 업데이트 시작!');

const items = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

items.forEach(item => {

  if (item.reference.length < 1) {
    return;
  }

  store(item);
});

console.info('국프의 정원 단계별 시간 기록 업데이트 완료!');

function store(item) {

  const updateExpression = [];
  let expressionAttributeValues = {};
  let lastDate;

  if (!item.reference.step11) {
    return;
  }
  updateExpression.push('set gardenHugStep11Date = :step11');
  expressionAttributeValues[':step11'] = item.reference.step11;
  lastDate = item.reference.step11;

  if (item.reference.step12) {
    updateExpression.push('gardenHugStep12Date = :step12');
    expressionAttributeValues[':step12'] = item.reference.step12;
    lastDate = item.reference.step12;
  }

  if (item.reference.step13) {
    updateExpression.push('gardenHugStep13Date = :step13');
    expressionAttributeValues[':step13'] = item.reference.step13;
    lastDate = item.reference.step13;
  }

  if (item.reference.step21) {
    updateExpression.push('gardenHugStep21Date = :step21');
    expressionAttributeValues[':step21'] = item.reference.step21;
    lastDate = item.reference.step21;
  }

  if (item.reference.step22) {
    updateExpression.push('gardenHugStep22Date = :step22');
    expressionAttributeValues[':step22'] = item.reference.step22;
    lastDate = item.reference.step22;
  } 

  if (item.reference.step23) {
    updateExpression.push('gardenHugStep23Date = :step23');
    expressionAttributeValues[':step23'] = item.reference.step23;
    lastDate = item.reference.step23;
  } 

  if (item.reference.step31) {
    updateExpression.push('gardenHugStep31Date = :step31');
    expressionAttributeValues[':step31'] = item.reference.step31;
    lastDate = item.reference.step31;
  }

  if (item.reference.step32) {
    updateExpression.push('gardenHugStep32Date = :step32');
    expressionAttributeValues[':step32'] = item.reference.step32;
    lastDate = item.reference.step32;
  }

  if (item.reference.step33) {
    updateExpression.push('gardenHugStep33Date = :step33');
    expressionAttributeValues[':step33'] = item.reference.step33;
    lastDate = item.reference.step33;
  }

  if (item.reference.step41) {
    updateExpression.push('gardenHugStep41Date = :step41');
    expressionAttributeValues[':step41'] = item.reference.step41;
    lastDate = item.reference.step41;
  }

  if (item.reference.step42) {
    updateExpression.push('gardenHugStep42Date = :step42');
    expressionAttributeValues[':step42'] = item.reference.step42;
    lastDate = item.reference.step42;
  } 

  if (item.reference.step43) {
    updateExpression.push('gardenHugStep43Date = :step43');
    expressionAttributeValues[':step43'] = item.reference.step43;
    lastDate = item.reference.step43;
  } 

  if (item.reference.step51) {
    updateExpression.push('gardenHugStep51Date = :step51');
    expressionAttributeValues[':step51'] = item.reference.step51;
    lastDate = item.reference.step51;
  } 

  if (item.reference.step52) {
    updateExpression.push('gardenHugStep52Date = :step52');
    expressionAttributeValues[':step52'] = item.reference.step52;
    lastDate = item.reference.step52;
  }

  if (item.reference.step53) {
    updateExpression.push('gardenHugStep53Date = :step53');
    expressionAttributeValues[':step53'] = item.reference.step53;
    lastDate = item.reference.step53;
  } 

  updateExpression.push('gardenHugStepLastDate = :ld');
  expressionAttributeValues[':ld'] = lastDate;

  console.log(updateExpression.join(', '));
  console.log(expressionAttributeValues);

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
