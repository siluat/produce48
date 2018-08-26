import React from 'react';
import { Image, Container, Card, Message } from 'semantic-ui-react';

const DMenu = () =>
  <div>
    <Message 
      style={{ textAlign: 'center' }}
      attached
      header='데스크탑 PC 전용 콘텐츠'
      content='이 페이지의 콘텐츠는 모바일 환경을 정상적으로 지원하지 않습니다.'
    >
    </Message>
    <Container style={{ paddingTop: '20px', paddingBottom: '20px', textAlign: 'center' }}>
      <Card as='a' href='/d1' target='_blank' 
        style={{ display: 'inline-block' }}
      >
        <Image src='/images/d/d1.png' />
        <Card.Content>
          <Card.Header>D1</Card.Header>
          <Card.Description>
            2차 순위 발표식<br/>
            TOP 30 한일 연습생 득표 점유 현황
          </Card.Description>
        </Card.Content>
      </Card>
      <Card as='a' href='/d3' target='_blank' 
        style={{ display: 'inline-block' }}
      >
        <Image src='/images/d/d3.png' />
        <Card.Content>
          <Card.Header>D3</Card.Header>
          <Card.Description>
            연습생들 흐름도?<br/>
            (<s>귀찮아서</s>미완성)
          </Card.Description>
        </Card.Content>
      </Card>
    </Container>
  </div>
  

export default DMenu;