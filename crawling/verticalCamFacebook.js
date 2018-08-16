const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'ap-northeast-2'});
const sns = new AWS.SNS({region: 'ap-northeast-2'});

const DB_TABLE_NAME = 'produce48';
const AWS_SNS_TARGET_ARN = 'arn:aws:sns:ap-northeast-2:876863305772:toSlack';

const params = {
  TableName : DB_TABLE_NAME,
};

const sleep = async (ms) => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, ms)
  });
}

process.on('unhandledRejection', error => {
  const message = '[ERROR][세로캠 페이스북] ' + error.message;

  const params = {
    Message: message,
    TargetArn: AWS_SNS_TARGET_ARN
  };

  sns.publish(params, (err, data) => {
    if (err)  console.log(err, err.stack);
    else      console.log(data);

    process.exit();
  });
});

documentClient.scan(params, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    crawling(data.Items);
  }
});

const crawling = async items => {
  console.info('세로캠 페이스북 반응 크롤링 시작!');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(items[0].verticalCamFacebookUrl,  {waitUntil: 'networkidle2'});
  await page.waitForSelector('#email');

  await page.type('#email', '');
  await page.type('#pass', '');
  await sleep(500);
  await page.click('#loginbutton');

  await page.waitForSelector('span[data-hover="tooltip"]');

  for (let i = 0; i < items.length; i++) {
    let item = items[i];

    if (!item.verticalCamFacebookUrl || !item.verticalCamFacebookUrl.length) {
      continue;
    }

    await page.goto(item.verticalCamFacebookUrl,  {waitUntil: 'networkidle2'});

    await page.waitForSelector('span[data-hover="tooltip"]');
    await page.click('span[data-hover="tooltip"]');

    await page.waitForSelector('a.pam.uiBoxLightblue.uiMorePagerPrimary');

    const likeCount = await page.evaluate(getLikeCount);

    store({
      id: item.id,
      name: item.name,
      like: likeCount,
    });
  }

  await browser.close();

  await reportComplete();

  console.info('세로캠 페이스북 반응 크롤링 완료!');
};

const getLikeCount = () => {
  const getParams = str => {
    var queryString = str || window.location.search || '';
    var keyValPairs = [];
    var params      = {};
    queryString     = queryString.replace(/.*?\?/,"");
  
    if (queryString.length)
    {
       keyValPairs = queryString.split('&');
       for (pairNum in keyValPairs)
       {
          var key = keyValPairs[pairNum].split('=')[0];
          if (!key.length) continue;
          if (typeof params[key] === 'undefined')
          params[key] = [];
          params[key].push(keyValPairs[pairNum].split('=')[1]);
       }
    }
    return params;
  }

  const selector = 'a.pam.uiBoxLightblue.uiMorePagerPrimary';
  let href = document.querySelector(selector).href;
  return parseInt(getParams(href)['total_count']);
};

function store(item) {
  const params = {
    TableName: DB_TABLE_NAME,
    Key: {
      id: item.id
    },
    UpdateExpression: 'set verticalCamFacebookLike = :l',
    ExpressionAttributeValues: {
      ':l': item.like,
    }
  };

  console.info(item.name, item.like);

  documentClient.update(params, (err) => {
    if (err) {
      console.error(err);
      console.error(params);
      process.exit();
    }
  });
};

const reportComplete = async () => {
  const message = '프로듀스48 30 연습생 세로캠 영상 페이스북 관련 정보를 업데이트 했습니다.';

  const params = {
    Message: message,
    TargetArn: AWS_SNS_TARGET_ARN
  };

  sns.publish(params, (err, data) => {
    if (err)  console.log(err, err.stack);
    else      console.log(data);
  });
};