import React from 'react';
import styled from 'styled-components';
import { Message } from 'semantic-ui-react';

const NoMatchImage = styled.img`
  width: 100%;
`

const NoMatch = ({
  t,
}) =>
  <div>
    <Message
      style={{ textAlign: 'center' }}
      attached
      header={t('invalid-url')}
      content={t('use-menu-on-top')}
    />
    <NoMatchImage src={'/images/notMatch/' + Math.floor(Math.random() * Math.floor(46)) + '.jpg'} />
  </div>

export default NoMatch;