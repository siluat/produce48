const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'ap-northeast-2'});
const sns = new AWS.SNS({region: 'ap-northeast-2'});

const DB_TABLE_NAME = 'produce48';
const AWS_SNS_TARGET_ARN = 'arn:aws:sns:ap-northeast-2:876863305772:toSlack';

const params = {
  TableName : DB_TABLE_NAME,
};

documentClient.scan(params, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    crawling(data.Items.filter(item => { return !item.retired; }));
  }
});

const getGardenUrl = idx => {
  return 'https://produce48.kr/m48_detail.php?idx=' + idx + '&cate=hug';
}

const crawling = async items => {
  console.info('국프의 정원 후원 현황 크롤링 시작!');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let url = getGardenUrl(item.gardenIdx);

    await page.goto(url,  {waitUntil: 'networkidle2'});

    const primeSelector = '#my_hug_';
    await page.waitForSelector(primeSelector);

    const hugRate = await page.evaluate(getHugRate);

    store({
      id: item.id,
      name: item.name,
      hugRate
    });
  }

  await browser.close();

  // await reportComplete();

  console.info('국프의 정원 후원 현황 크롤링 완료!');
};

const getHugRate = () => {
  const selector = [
    '#steps',
    'span'
  ].join(' ');
  return parseFloat(document.querySelector(selector).style.width);
};

function store(item) {
  const params = {
    TableName: DB_TABLE_NAME,
    Key: {
      id: item.id
    },
    UpdateExpression: 'set gardenHugRate = :ghr',
    ExpressionAttributeValues: {
      ':ghr': item.hugRate
    }
  };

  console.info('Store ' + item.name + '\'s data...');

  documentClient.update(params, (err, data) => {
    if (err) {
      console.error(err);
      console.error(params);
      process.exit();
    }
  });
};

const reportComplete = async () => {
  var message = '국프의 정원 후원 현황 정보를 업데이트 했습니다.';

  var params = {
    Message: message,
    TargetArn: AWS_SNS_TARGET_ARN
  };

  for (var i = 0; i < 1; i++) {
    sns.publish(params, function(err, data) {
      if (err)  console.log(err, err.stack);
      else      console.log(data);
    });
  }
};