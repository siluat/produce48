import React, { Component } from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { Menu, Sticky, Dropdown, Icon, Flag, Label } from 'semantic-ui-react';
import ReactGA from 'react-ga';
import { I18n } from 'react-i18next';

import i18n from './i18n';

import ChangeLog from './ChangeLog';
import ConceptEndingRanking from './ConceptEndingRanking';
import Footer from './Footer';
import Garden from './Garden';
import GroupBattleDirectCamRanking from './GroupBattleDirectCamRanking';
import NekkoyaDirectCamRanking from './NekkoyaDirectCamRanking';
import NoMatch from './NotMatch';
import PositionDirectCamRanking from './PositionDirectCamRanking';
import SpecialClipRanking from './SpecialClipRanking';

import './important.css';
import VerticalCamRanking from './VerticalCamRanking';

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
      <I18n>
        {
          (t, { i18n }) => (
            <Router>
              <div ref={this.handleContextRef}>
                <Sticky context={contextRef} className='top-menu'>
                  <Menu
                    attached
                    inverted
                  >
                    <Dropdown
                      style={{ width: '78%' }}
                      item
                      text='Menu'
                    >
                      <Dropdown.Menu >
                        <Dropdown.Item href='/garden'>
                          {t('top-menu-garden')}
                        </Dropdown.Item>
                        <Dropdown.Item href='/conceptEnding'>
                          {t('top-menu-concept-ending')}
                        </Dropdown.Item>
                        <Dropdown.Item href='/verticalCam'>
                          {t('top-menu-vertical-cam')}
                        </Dropdown.Item>
                        <Dropdown.Item href='/special'>
                          {t('top-menu-special-clip')}
                        </Dropdown.Item>
                        <Dropdown.Item href='/position'>
                          {t('top-menu-position')}
                        </Dropdown.Item>
                        <Dropdown.Item href='/groupBattle'>
                          {t('top-menu-group')}
                        </Dropdown.Item>
                        <Dropdown.Item href='/nekkoya'>
                          {t('top-menu-nekkoya')}
                        </Dropdown.Item>
                        <Dropdown.Item href='#'>
                          {t('top-menu-concept')}
                          &nbsp;&nbsp;
                          <Label 
                            color='pink' size='small'
                            style={{ position: 'absolute', top: '9px'}}
                          >
                            {t('preparing')}
                          </Label>
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        {
                          (i18n.language !== 'jp') 
                            ? 
                              <Dropdown.Item href='/changelog'>
                                업데이트 기록
                              </Dropdown.Item>
                            : null
                        }
                      </Dropdown.Menu>
                    </Dropdown>
                    {
                      (i18n.language === 'jp') 
                        ? <Menu.Item as='a'
                            style={{ width: '22%'}}
                            onClick={() => { i18n.changeLanguage('kr'); }}
                          >
                            <Icon style={{ margin: 'auto', marginRight: '5px' }} name='exchange' />
                            <Flag style={{ margin: 'auto', marginLeft: '5px' }} name='kr' />
                          </Menu.Item>
                        : <Menu.Item as='a'
                            style={{ width: '22%'}}
                            onClick={() => { i18n.changeLanguage('jp'); }}
                          >
                            <Icon style={{ margin: 'auto', marginRight: '5px' }} name='exchange' />
                            <Flag style={{ margin: 'auto', marginLeft: '5px' }} name='jp' />
                          </Menu.Item>
                    }
                  </Menu>
                </Sticky>
                <Switch>
                  <Route
                    exact path="/" 
                    render={(props) => <ConceptEndingRanking {...props} i18n={i18n} t={t} />}
                  />
                  <Route
                    exact path="/conceptEnding" 
                    render={(props) => <ConceptEndingRanking {...props} i18n={i18n} t={t} />}
                  />
                  <Route
                    exact path="/verticalCam" 
                    render={(props) => <VerticalCamRanking {...props} i18n={i18n} t={t} />}
                  />
                  <Route
                    exact path="/special" 
                    render={(props) => <SpecialClipRanking {...props} i18n={i18n} t={t} />}
                  />
                  <Route
                    exact path="/position" 
                    render={(props) => <PositionDirectCamRanking {...props} i18n={i18n} t={t} />}
                  />
                  <Route 
                    exact path="/groupBattle"
                    render={(props) => <GroupBattleDirectCamRanking {...props} i18n={i18n} t={t} />}
                  />
                  <Route 
                    exact path="/nekkoya"
                    render={(props) => <NekkoyaDirectCamRanking {...props} i18n={i18n} t={t} />}
                  />
                  <Route
                    exaxt path="/garden"
                    render={(props) => <Garden {...props} i18n={i18n} t={t} />}
                  />
                  <Route
                    exaxt path="/changelog"
                    component={ChangeLog}
                  />
                  <Route
                    render={(props) => <NoMatch {...props} i18n={i18n} t={t} />}
                  />
                </Switch>
                <Footer />
              </div>
            </Router>
          )
        }
      </I18n>
    )
  }
}

export default App;