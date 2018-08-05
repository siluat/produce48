import React from 'react';
import { Header, Segment, List } from 'semantic-ui-react';

const ChangeLog = () =>
  <div>
    <Header as='h2' attached='top'>
      2018-08-06
    </Header>
    <Segment attached>
      <List bulleted>
        <List.Item>연습생 클릭 또는 터치시 순위변동 차트 표시</List.Item>
      </List>
    </Segment>
    <Header as='h2' attached='top'>
      2018-08-02
    </Header>
    <Segment attached>
      <List bulleted>
        <List.Item>국프의 정원 단계별 달성일 추가</List.Item>
        <List.Item>국프의 정원 단계별 달성시간 추가</List.Item>
        <List.Item>국프의 정원 두번째 정렬 조건으로 달성일을 적용</List.Item>
      </List>
    </Segment>
    <Header as='h2' attached='top'>
      2018-08-01
    </Header>
    <Segment attached>
      <List bulleted>
        <List.Item>국프의 정원 후원 현황 추가</List.Item>
      </List>
    </Segment>
    <Header as='h2' attached='top'>
      2018-07-29
    </Header>
    <Segment attached>
      <List bulleted>
        <List.Item>포지션 평가 현장 투표 순위 추가</List.Item>
        <List.Item>그룹 배틀 현장 투표 순위 추가</List.Item>
        <List.Item>연습생 이름 옆에 마지막 순위 발표식의 순위 표시</List.Item>
      </List>
    </Segment>
    <Header as='h2' attached='top'>
      2018-07-27
    </Header>
    <Segment attached>
      <List bulleted>
        <List.Item>그룹 배틀 직캠 순위 추가</List.Item>
        <List.Item>메뉴 추가</List.Item>
      </List>
    </Segment>
    <Header as='h2' attached='top'>
      2018-07-26
    </Header>
    <Segment attached>
      <List bulleted>
        <List.Item>포지션 평가 직캠 순위 추가</List.Item>
      </List>
    </Segment>
  </div>

export default ChangeLog;