import React, { Component } from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { Menu, Sticky, Dropdown } from 'semantic-ui-react';
import ReactGA from 'react-ga';

import ChangeLog from './ChangeLog';
import Footer from './Footer';
import Garden from './Garden';
import GroupBattleDirectCamRanking from './GroupBattleDirectCamRanking';
import NekkoyaDirectCamRanking from './NekkoyaDirectCamRanking';
import PositionDirectCamRanking from './PositionDirectCamRanking';

import './important.css';

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
  }

  handleContextRef = contextRef => this.setState({ contextRef })

  render() {
    const {
      contextRef
    } = this.state;

    return (
      <Router>
        <div ref={this.handleContextRef}>
          <Sticky context={contextRef} className='top-menu'>
            <Menu
              attached 
              fluid 
              widths={1}
              inverted
            >
              <Dropdown
                item 
                simple
                text='Menu'
                direction='right'
              >
                <Dropdown.Menu>
                  <Dropdown.Item href='/garden'>
                    국정원 후원 현황
                  </Dropdown.Item>
                  <Dropdown.Item href='/position'>
                    포지션 평가 순위
                  </Dropdown.Item>
                  <Dropdown.Item href='/groupBattle'>
                    그룹 배틀 순위
                  </Dropdown.Item>
                  <Dropdown.Item href='/nekkoya'>
                    내꺼야 직캠 순위
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href='/changelog'>
                    업데이트 기록
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu>
          </Sticky>
          <Switch>
            <Route
              exact path="/" 
              component={Garden}
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
              exact path="/nekkoya"
              component={NekkoyaDirectCamRanking}
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
              component={Garden}
            />
          </Switch>
          <Footer />
        </div>
      </Router>
    )
  }
}

export default App;