var download = require('download-file')
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-2'
});

const DB_TABLE_NAME = 'produce48';
const DOWNLOAD_PATH = './public/images/mainPictures/'

const params = {
  TableName : DB_TABLE_NAME,
};

documentClient.scan(params, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    crawling(data.Items);
  }
});

const crawling = (items) => {
  items.forEach(item => {
    const options = {
      directory: DOWNLOAD_PATH,
      filename: item.id + '.jpg'
    };

    download(encodeURI(item.mainPictureUrl), options, function(err){
      if (err) throw err
      console.log("meow");
    }) 
  });
};