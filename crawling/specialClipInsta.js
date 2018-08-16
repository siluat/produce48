const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'ap-northeast-2'});
const sns = new AWS.SNS({region: 'ap-northeast-2'});

const DB_TABLE_NAME = 'produce48';
const AWS_SNS_TARGET_ARN = 'arn:aws:sns:ap-northeast-2:876863305772:toSlack';

const params = {
  TableName : DB_TABLE_NAME,
};

process.on('unhandledRejection', error => {
  const message = '[ERROR][스페셜 영상 인스타] ' + error.message;

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
  console.info('스페셜 클립 인스타 반응 크롤링 시작!');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let i = 0; i < items.length; i++) {
    let item = items[i];

    if (!item.specialClipInstaUrl || !item.specialClipInstaUrl.length) {
      continue;
    }

    await page.goto(item.specialClipInstaUrl,  {waitUntil: 'networkidle2'});

    const primeSelector = '#react-root';
    await page.waitForSelector(primeSelector);

    const likeCount = await page.evaluate(getLikeCount);
    // const viewCount = await page.evaluate(getViewCount);
    // const commentCount = await page.evaluate(getCommentCount);

    store({
      id: item.id,
      name: item.name,
      // view: viewCount,
      like: likeCount,
      // comment: commentCount
    });
  }

  await browser.close();

  await reportComplete();

  console.info('스페셜 클립 인스타 반응 크롤링 완료!');
};

const getLikeCount = () => {
  return window._sharedData.entry_data.PostPage[0].graphql.shortcode_media.edge_media_preview_like.count;
};

const getViewCount = () => {
  const selector = '.title_info .play';
  let count = document.querySelector(selector).innerText;
  return parseInt(count.replace(/,/g, ''));
};

const getCommentCount = () => {
  const selector = '._commentCount';
  let count = document.querySelector(selector).innerText;
  return parseInt(count.replace(/,/g, ''));
};

function store(item) {
  const params = {
    TableName: DB_TABLE_NAME,
    Key: {
      id: item.id
    },
    UpdateExpression: 'set specialClipInstaLike = :l',
    ExpressionAttributeValues: {
      // ':v': item.view,
      ':l': item.like,
      // ':c': item.comment
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
  var message = '프로듀스48 30 연습생 스페셜 클립 영상 인스타 관련 정보를 업데이트 했습니다.';

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