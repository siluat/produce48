import React, { Component } from 'react';
import { Switch, BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Icon, Menu, Segment, Sidebar, Button } from 'semantic-ui-react';
import './App.css';
import ReactGA from 'react-ga';

import PositionDirectCamRanking from './PositionDirectCamRanking';
import GroupBattleDirectCamRanking from './GroupBattleDirectCamRanking';
import Garden from './Garden';
import ChangeLog from '../pages/ChangeLog';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebar: false,
    };

    if (process.env.NODE_ENV === 'production') {
      ReactGA.initialize('UA-122956473-2');
      ReactGA.pageview(window.location.pathname);
    }

    this.onClickSidebarToggle = this.onClickSidebarToggle.bind(this);
    this.onSidebarHide = this.onSidebarHide.bind(this);
    this.onClickSidebarMenu = this.onClickSidebarMenu.bind(this);
  }

  onClickSidebarToggle(event) {
    event.stopPropagation();
    this.setState({ sidebar: !this.state.sidebar })
  }

  onSidebarHide() {
    this.setState({ sidebar: false })
  }

  onClickSidebarMenu() {
    this.setState({ sidebar: false })
  }

  render() {
    const {
      sidebar
    } = this.state;

    return (
      <Router>
        <div>
          <Sidebar.Pushable as={Segment} attached>
            <Sidebar
              as={Menu}
              animation='overlay'
              inverted
              onHide={this.onSidebarHide}
              visible={sidebar}
              vertical
              width='thin'
            >
              <Menu.Item as={Link} to='/garden' onClick={this.onClickSidebarMenu}>
                국정원 후원 현황
              </Menu.Item>
              <Menu.Item as={Link} to='/position' onClick={this.onClickSidebarMenu}>
                포지션 평가 순위
              </Menu.Item>
              <Menu.Item as={Link} to='/groupBattle' onClick={this.onClickSidebarMenu}>
                그룹 배틀 순위
              </Menu.Item>
              <Menu.Item>
              </Menu.Item>
              <Menu.Item as={Link} to='/changelog' onClick={this.onClickSidebarMenu}>
                업데이트 기록
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher dimmed={sidebar} onClick={this.onClickSidebarMenu}>
              <Button.Group widths='5' attached>
                <Button onClick={this.onClickSidebarToggle}>
                  <Icon name='sidebar'/>
                  Menu
                </Button>
              </Button.Group>
              <Switch>
                <Route
                  exact path="/" 
                  component={PositionDirectCamRanking}
                />
                <Route
                  exact path="/position" 
                  component={PositionDirectCamRanking}
                />
                <Route 
                  exact path="/groupBattle"
                  component={GroupBattleDirectCamRanking}
                />
                <Route
                  exaxt path="/garden"
                  component={Garden}
                />
                <Route
                  exaxt path="/changelog"
                  component={ChangeLog}
                />
                <Route
                  component={PositionDirectCamRanking}
                />
              </Switch>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
    </Router>
    )
  }
}

export default App;