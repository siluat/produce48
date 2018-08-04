import React from 'react';
import styled from 'styled-components';
import { Message, Icon } from 'semantic-ui-react';

const Contact = styled.span`
  line-height: 1px;
`

const Footer = () =>
  <Message attached='bottom'>
    <Contact><Icon name='mail' />pick.the.nako@gmail.com</Contact><br/>
    <span>&copy; 2018, Pick the Nako, Rika. All rights reserved.</span>
  </Message>

export default Footer;