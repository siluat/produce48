# PDUNOW48

![pdunow48](public/images/og_image.jpg)

엠넷 프로듀스48 덕질  
프로듀스48 관련 현황 정보 수집 및 웹서비스 제공 프로젝트

Website : https://produce48.surge.sh

## External Resources

- Database : AWS DynamoDB
- API : AWS API Gateway, AWS Lambda
- Reporting : AWS SNS, AWS Lambda
- Web publishing : surge

## Util

```bash
$ node ./util/createBaseMap.js // 빈 참조 맵파일 생성
```

## Crawling

```bash
$ node ./crawling/officialProfile.js // 공식 홈페이지에서 소녀들의 프로필 정보를 겟, DynamoDB에 저장
$ node ./crawling/groupBattleDirectCam.js // 그룹 배틀 네캐 직캠 정보 수집, DynamoDB에 저장
$ node ./crawling/positionDirectCam.js // 포지션 평가 네캐 직캠 정보 수집, DynamoDB에 저장
```

## Update DB

```bash
$ node ./dynamoDB/updatePositionDirectCamUrl.js // 포지션 평가 영상 주소 업데이트
$ node ./dynamoDB/updateGroupBattleDirectCamUrl.js // 포지션 평가 영상 주소 업데이트
$ node ./dynamoDB/updatePositionVote.js // 포지션 평가 현장투표수 업데이트
$ node ./dynamoDB/updateGroupBattleVote.js // 포지션 평가 현장투표수 업데이트
```

## Running site locally

```bash
$ yarn start
```

## Build site

```bash
$ yarn build
```

## Deploy site

```bash
$ yarn deploy
```
