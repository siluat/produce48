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
| node ./util/createBaseMap.js | 빈 참조 맵파일 생성 |