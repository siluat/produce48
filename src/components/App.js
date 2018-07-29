import React, { Component } from 'react';
import { Switch, BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Icon, Menu, Segment, Sidebar, Button } from 'semantic-ui-react';
import './App.css';
import ReactGA from 'react-ga';

import PositionDirectCamRanking from './PositionDirectCamRanking';
import GroupBattleDirectCamRanking from './GroupBattleDirectCamRanking';
import ChangeLog from '../pages/ChangeLog';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebar: false,
    };

    ReactGA.initialize('UA-122956473-1');
    ReactGA.pageview(window.location.pathname);

    this.onClickSidebarToggle = this.onClickSidebarToggle.bind(this);
    this.onSidebarHide = this.onSidebarHide.bind(this);
    this.onClickSidebarMenu = this.onClickSidebarMenu.bind(this);
  }

  onClickSidebarToggle() {
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
          <Sidebar.Pushable as={Segment}>
            <Sidebar
              as={Menu}
              animation='overlay'
              inverted
              onHide={this.onSidebarHide}
              vertical
              visible={sidebar}
              width='thin'
            >
            <Menu.Item>
              <Link to='/groupBattle' onClick={this.onClickSidebarMenu}>
                그룹 배틀 순위
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to='/position' onClick={this.onClickSidebarMenu}>
                포지션 평가 순위
              </Link>
            </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher>
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