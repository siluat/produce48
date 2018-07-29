import React from 'react';
import { Header, Segment, List } from 'semantic-ui-react';

const ChangeLog = () =>
  <div>
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