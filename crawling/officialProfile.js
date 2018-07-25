const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-2'
});

const BASE_URL = 'http://produce48.mnet.com/pc/profile/';
const HOW_MANY_GIRLS = 96;

(async () => {
  console.log('연습생 공식 프로필 크롤링 시작!');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (var id = 1; id <= HOW_MANY_GIRLS; id++) {
    const profile = await getProfile(page, id);
    
    await store(profile);

    await page.waitFor(1000);   // 매너(?) 크롤링!
  }

  await browser.close();

  console.log('연습생 공식 프로필 크롤링 완료!');
})();

const getProfile = async (page, id) => {
  await page.goto(BASE_URL + id, {waitUntil: 'networkidle2'});

  const primeSelector = '.agencyDesc';
  await page.waitForSelector(primeSelector);

  const name = await page.evaluate(getName);
  const mainPictureUrl = await page.evaluate(getMainPictureUrl);
  
  return {
    id: id,
    name: name,
    mainPictureUrl, mainPictureUrl
  }
};

const getName = () => {
  const selector = [
    '.agencyDesc',
    '.descBox',
    '.descRight',
    'dt:first-child',
    'p:nth-child(2)',
    'span'
  ].join(' ');

  return document.querySelector(selector).textContent;
};

const getMainPictureUrl = () => {
  const SELECTOR = [
    '.agencyDesc',
    '.descBox',
    '.descLeft',
    '.portfolio',
    'img'
  ].join(' ');

  return document.querySelector(SELECTOR).getAttribute('src');
};

const store = async (profile) => {
  const params = {
    TableName: 'produce48',
    Item: profile
  }

  console.log('Store ' + profile.name + '\'s profile...');

  documentClient.put(params, (err, data) => {
    if (err) {
      console.error(err);
      console.error(params);
      process.exit();
    }
  });
};