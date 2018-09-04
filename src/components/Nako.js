import React from 'react';
import styled from 'styled-components';
import { Message } from 'semantic-ui-react';

const NoMatchImage = styled.img`
  width: 100%;
  max-width: 800px;
`

const Nako = ({
  t,
}) =>
  <div style={{ textAlign: 'center' }}>
    <Message
      style={{ textAlign: 'center' }}
      color='pink'
      attached
      header={t('cong-to-nako')}
      content={t('nakonako')}
    />
    <NoMatchImage src={'/images/notMatch/' + Math.floor(Math.random() * Math.floor(56)) + '.jpg'} />
  </div>

export default Nako;