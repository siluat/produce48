const puppeteer = require('puppeteer');
const moment = require('moment');
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

    store(item, hugRate);
  }

  await browser.close();

  await reportComplete();

  console.info('국프의 정원 후원 현황 크롤링 완료!');
};

const getHugRate = () => {
  const selector = [
    '#steps',
    'span'
  ].join(' ');
  return parseFloat(document.querySelector(selector).style.width);
};

function store(item, hugRate) {
  const updateExpression = ['set gardenHugRate = :ghr'];
  let expressionAttributeValues = { ':ghr' : hugRate };
  let lastDate;

  if (hugRate === 6.6 && !item.gardenHugStep11Date) {
    updateExpression.push('gardenHugStep11Date = :step11date');
    expressionAttributeValues[':step11date'] = moment().format('YYYY-MM-DD');
    lastDate  = moment().format('YYYY-MM-DD');
  }

  if (hugRate === 13.2 && !item.gardenHugStep12Date) {
    updateExpression.push('gardenHugStep12Date = :step12date');
    expressionAttributeValues[':step12date'] = moment().format('YYYY-MM-DD');
    lastDate  = moment().format('YYYY-MM-DD');
  }

  if (hugRate === 20 && !item.gardenHugStep13Date) {
    updateExpression.push('gardenHugStep13Date = :step13date');
    expressionAttributeValues[':step13date'] = moment().format('YYYY-MM-DD');
    lastDate  = moment().format('YYYY-MM-DD');
  }

  if (hugRate === 26.6 && !item.gardenHugStep21Date) {
    updateExpression.push('gardenHugStep21Date = :step21date');
    expressionAttributeValues[':step21date'] = moment().format('YYYY-MM-DD');
    lastDate  = moment().format('YYYY-MM-DD');
  }

  if (hugRate === 33.2 && !item.gardenHugStep22Date) {
    updateExpression.push('gardenHugStep22Date = :step22date');
    expressionAttributeValues[':step22date'] = moment().format('YYYY-MM-DD');
    lastDate  = moment().format('YYYY-MM-DD');
  }

  if (hugRate === 40 && !item.gardenHugStep23Date) {
    updateExpression.push('gardenHugStep23Date = :step23date');
    expressionAttributeValues[':step23date'] = moment().format('YYYY-MM-DD');
    lastDate  = moment().format('YYYY-MM-DD');
  }

  if (hugRate === 46.6 && !item.gardenHugStep31Date) {
    updateExpression.push('gardenHugStep31Date = :step31date');
    expressionAttributeValues[':step31date'] = moment().format('YYYY-MM-DD');
    lastDate  = moment().format('YYYY-MM-DD');
  }

  if (hugRate === 53.2 && !item.gardenHugStep32Date) {
    updateExpression.push('gardenHugStep32Date = :step32date');
    expressionAttributeValues[':step32date'] = moment().format('YYYY-MM-DD');
    lastDate  = moment().format('YYYY-MM-DD');
  }

  if (hugRate === 60 && !item.gardenHugStep33Date) {
    updateExpression.push('gardenHugStep33Date = :step33date');
    expressionAttributeValues[':step33date'] = moment().format('YYYY-MM-DD');
    lastDate  = moment().format('YYYY-MM-DD');
  }

  if (hugRate === 66.6 && !item.gardenHugStep41Date) {
    updateExpression.push('gardenHugStep41Date = :step41date');
    expressionAttributeValues[':step41date'] = moment().format('YYYY-MM-DD');
    lastDate  = moment().format('YYYY-MM-DD');
  }

  if (hugRate === 73.2 && !item.gardenHugStep42Date) {
    updateExpression.push('gardenHugStep42Date = :step42date');
    expressionAttributeValues[':step42date'] = moment().format('YYYY-MM-DD');
    lastDate  = moment().format('YYYY-MM-DD');
  }

  if (hugRate === 80 && !item.gardenHugStep43Date) {
    updateExpression.push('gardenHugStep43Date = :step43date');
    expressionAttributeValues[':step43date'] = moment().format('YYYY-MM-DD');
    lastDate  = moment().format('YYYY-MM-DD');
  }

  if (hugRate === 86.6 && !item.gardenHugStep51Date) {
    updateExpression.push('gardenHugStep51Date = :step51date');
    expressionAttributeValues[':step51date'] = moment().format('YYYY-MM-DD');
    lastDate  = moment().format('YYYY-MM-DD');
  }

  if (hugRate === 93.2 && !item.gardenHugStep52Date) {
    updateExpression.push('gardenHugStep52Date = :step52date');
    expressionAttributeValues[':step52date'] = moment().format('YYYY-MM-DD');
    lastDate  = moment().format('YYYY-MM-DD');
  }

  if (hugRate === 100 && !item.gardenHugStep53Date) {
    updateExpression.push('gardenHugStep53Date = :step53date');
    expressionAttributeValues[':step53date'] = moment().format('YYYY-MM-DD');
    lastDate  = moment().format('YYYY-MM-DD');
  }

  if (lastDate) {
    updateExpression.push('gardenHugStepLastDate = :ld');
    expressionAttributeValues[':ld'] = lastDate;
  }

  const params = {
    TableName: DB_TABLE_NAME,
    Key: {
      id: item.id
    },
    UpdateExpression: updateExpression.join(', '),
    ExpressionAttributeValues: expressionAttributeValues
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