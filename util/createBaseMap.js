const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-2'
});

const DB_TABLE_NAME = 'produce48';
const DATA_PATH = './data/';
const USAGE = 'Usage: node ./util/createBaseMap.js [filename]';

if (process.argv.length < 3) {
  console.info(USAGE);
  process.exit();
}

const filename = process.argv[2];

var params = {
  TableName : DB_TABLE_NAME
};

documentClient.scan(params, function(err, data) {
  if (err) console.log(err);

  var newItemList = [];
   
  const items = data.Items;
  items.forEach(item => {
    newItemList.push({
      id: item.id,
      name: item.name,
      reference: ''
    });
  });

  newItemList.sort((a, b) => {
    return a.id - b.id;
  })

  saveToJsonFile(newItemList);
});

const saveToJsonFile = newItemList => {
  var fs = require('fs');
  var json = JSON.stringify(newItemList, null, 2);
  fs.writeFileSync(DATA_PATH + filename + '.json', json, 'utf8');
}