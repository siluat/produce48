# produce48

엠넷 프로듀스48 덕질

## Dependency

- node.js v8
- puppeteer
- AWS DynomoDB

## Commands

| Command | Description |
| --- | --- |
| node ./crawling/officialProfile.js | 공식 홈페이지에서 소녀들의 프로필 정보를 겟, DynamoDB에 저장 |
| node ./crawling/groupBattleDirectCam.js | 포지션 평가 직캠 관련 정보 수집, DynamoDB에 저장 |
| node ./crawling/positionDirectCam.js | 포지션 평가 직캠 관련 정보 수집, DynamoDB에 저장 |
| node ./util/createBaseMap.js | 빈 참조 맵파일 생성 |
| node ./dynamoDB/updatePositionDirectCamUrl.js | 포지션 평가 영상 주소 업데이트 |
| node ./dynamoDB/updateGroupBattleDirectCamUrl.js | 포지션 평가 영상 주소 업데이트 |
| node ./dynamoDB/updatePositionVote.js | 포지션 평가 현장투표수 업데이트 |
| node ./dynamoDB/updateGroupBattleVote.js | 포지션 평가 현장투표수 업데이트 |

## Step

1. node ./crawling/officialProfile.js
2. node ./dynamoDB/updateData.js ./data/positionDirectCam.json
3. node ./crawling/positionDirectCam.js