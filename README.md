# PRODUCE 48 NOW

![pdunow48](resources/now_logo/type1.jpg)

엠넷 프로듀스 48 덕질  
프로듀스 48 관련 정보 자동 수집 및 집계 현황 제공 프로젝트

Website : https://produce48.surge.sh

## External Resources

- Crawling : AWS EC2, AWS CloudWatch, AWS Lambda, AWS SNS
- Database : AWS DynamoDB
- API : AWS API Gateway, AWS Lambda
- Web site publishing : surge

## Utility

```bash
# 빈 참조 맵파일 생성
$ node ./util/createBaseMap.js

# 공식 홈페이지에서 연습생들의 메인 프로필 사진을 다운로드
$ node ./util/downloadMainPicture.js

# 국프의 정원 연습생별 코드를 공식 홈페이지의 연습생별 코드와 연결
$ node ./util/mappingGardenIdx.js
```

## Crawling

크롤링한 데이터는 모두 AWS DynamoDB에 저장

```bash
# 콘셉트 평가 직캠 네이버 티비 하트수, 조회수, 댓글수 수집
$ node ./crawling/conceptDirectCam.js

# 콘셉트 평가 팀별 영상 네이버 티비 하트수, 조회수, 댓글수 수집
$ node ./crawling/conceptEval.js

# 콘셉트 평가 엔딩 요정 영상 네이버 티비 하트수, 조회수, 댓글수 수집
$ node ./crawling/conceptEvalEnding.js

# 국프의 정원 후원 현황 수집
$ node ./crawling/gardensHug.js

# 지니 뮤직 실시간 차트에서 콘셉트 평가곡 순위 수집
$ node ./crawling/genieChart.js

# 그룹 배틀 직캠 네이버 티비 하트수, 조회수, 댓글수 수집
$ node ./crawling/groupBattleDirectCam.js

# 멜론 실시간 차트에서 콘셉트 평가곡 순위 수집
$ node ./crawling/melonChart.js

# 네이버 뮤직 실시간 차트에서 콘셉트 평가곡 순위 수집
$ node ./crawling/naverChart.js

# 내꺼야 직캠 네이버 티비 하트수, 조회수, 댓글수 수집
$ node ./crawling/nekkoyaDirectCam.js

# 공식 홈페이지에서 연습생 이름 및 프로필 사진 주소 수집
$ node ./crawling/officialProfile.js

# 포지션 직캠 네이버 티비 하트수, 조회수, 댓글수 수집
$ node ./crawling/positionDirectCam.js

# 스페셜 영상 네이버 티비 하트수, 조회수, 댓글수 수집
$ node ./crawling/specialClip.js

# 스페셜 영상 인스타그램 하트수 수집
$ node ./crawling/specialClipInsta.js

# 스페셜 영상 트위터 하트수 수집
$ node ./crwaling/specialClipTwitter.js

# 세로캠 페이스북 좋아요수 수집
$ node ./crawling/verticalCamFacebook.js

# 세로캠 트위터 하트수 수집
$ node ./crawling/verticalCamTwitter.js

# 공식 홈페이지에서 1주차 순위 수집
$ node ./crawling/week1Rank.js

# 공식 홈페이지에서 2주차 순위 수집
$ node ./crawling/week2Rank.js

# 공식 홈페이지에서 3주차 순위 수집
$ node ./crawling/week3Rank.js

# 공식 홈페이지에서 9주차 순위 수집
$ node ./crawling/week9Rank.js
```

## Update DB

```bash
# 콘셉트 평가곡 정보 테이블 초기화
$ node ./insertConceptEvalMusic.js

# 국프의 정원 후원 단계 달성 날짜 정보를 업데이트(크롤링하지 못했던 예전 데이터 수동 업데이트)
$ node ./dynamoDB/updateGardenStepDate.js

# 국프의 정원 후원 단계 달성 인증 영상 정보를 업데이트
$ node ./dynamoDB/updateGardenStepVideo.js

# 그룹 배틀 직캠 영상 주소 업데이트
$ node ./dynamoDB/updateGroupBattleDirectCamUrl.js

# 그룹 배틀 현장투표수 업데이트
$ node ./dynamoDB/updateGroupBattleVote.js

# 연습생 최근 순위 업데이트
$ node ./dynamoDB/updateLastRank.js

# 연습생 영문 이름 업데이트
$ node ./dynamoDB/updateNameInEnglish.js

# 포지션 평가 직캠 영상 주소 업데이트
$ node ./dynamoDB/updatePositionDirectCamUrl.js

# 포지션 평가 현장투표수 업데이트
$ node ./dynamoDB/updatePositionVote.js

# 연습생 방출 정보 업데이트
$ node ./dynamoDB/updateRetired.js
```

## Running site locally

```bash
$ yarn
$ yarn start
```

## Build site

```bash
$ yarn build
```

## Deploy site

[surge](https://surge.sh/) 에 배포

```bash
$ yarn deploy
```
