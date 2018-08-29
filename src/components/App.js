import React, { Component } from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { Menu, Sticky, Dropdown, Label } from 'semantic-ui-react';
import ReactGA from 'react-ga';
import { I18n } from 'react-i18next';

import i18n from './i18n';

import ChangeLog from './ChangeLog';
import ConceptDirectCamRanking from './ConceptDirectCamRanking';
import ConceptEndingRanking from './ConceptEndingRanking';
import ConceptMusicRanking from './ConceptMusicRanking';
import D2 from './D2';
import Footer from './Footer';
import Garden from './Garden';
import GroupBattleDirectCamRanking from './GroupBattleDirectCamRanking';
import MCountdownSpecialStageRanking from './MCountdownSpecialStageRanking';
import NekkoyaDirectCamRanking from './NekkoyaDirectCamRanking';
import NoMatch from './NotMatch';
import PositionDirectCamRanking from './PositionDirectCamRanking';
import PunchQueen from './PunchQueen';
import SpecialClipRanking from './SpecialClipRanking';

import './important.css';
import VerticalCamRanking from './VerticalCamRanking';
import DMenu from './DMenu';

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
                      style={{ width: '68%' }}
                      item
                      text='Menu'
                    >
                      <Dropdown.Menu >                        
                        <Dropdown.Item href='/garden'>
                          {t('top-menu-garden')}
                        </Dropdown.Item>
                        {
                          (i18n.language !== 'jp' && i18n.language !== 'en') 
                            && <Dropdown.Item href='/punchQueen'>
                                {t('top-menu-punchqueen')}
                              </Dropdown.Item>
                        }
                        <Dropdown.Item href='/mCountdown'>
                          {t('top-menu-m-countdown')}
                        </Dropdown.Item>
                        <Dropdown.Item href='/concept'>
                          {t('top-menu-concept-trainee')}
                        </Dropdown.Item>
                        <Dropdown.Item href='/conceptMusic'>
                          {t('top-menu-concept-music')}
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
                        {
                          (i18n.language !== 'jp' && i18n.language !== 'en') 
                            ? <Dropdown.Item href='/d'>
                                {t('심심풀이')}
                                &nbsp;&nbsp;
                                <Label 
                                  color='pink' size='small'
                                  style={{ position: 'absolute', top: '9px'}}
                                >
                                  Desktop Only
                                </Label>
                              </Dropdown.Item>
                            : null
                        }
                        <Dropdown.Divider />
                        {
                          (i18n.language !== 'jp' && i18n.language !== 'en') 
                            ? 
                              <Dropdown.Item href='/changelog'>
                                업데이트 기록
                              </Dropdown.Item>
                            : null
                        }
                      </Dropdown.Menu>
                    </Dropdown>
                    {
                      (i18n.language !== 'kr') 
                        ? <Menu.Item as='a'
                            style={{ width: '16%', display: 'inline-block', textAlign: 'center' }}
                            onClick={() => { i18n.changeLanguage('kr'); }}
                          >
                            KR
                          </Menu.Item>
                        : null
                    }
                    {
                      (i18n.language !== 'jp') 
                        ? <Menu.Item as='a'
                            style={{ width: '16%', display: 'inline-block', textAlign: 'center' }}
                            onClick={() => { i18n.changeLanguage('jp'); }}
                          >
                            JP
                          </Menu.Item>
                        : null
                    }
                    {
                      (i18n.language !== 'en') 
                        ? <Menu.Item as='a'
                            style={{ width: '16%', display: 'inline-block', textAlign: 'center' }}
                            onClick={() => { i18n.changeLanguage('en'); }}
                          >
                            EN
                          </Menu.Item>
                        : null
                    }
                  </Menu>
                </Sticky>
                <Switch>
                  <Route
                    exact path="/" 
                    render={(props) => <Garden {...props} i18n={i18n} t={t} />}
                  />
                  <Route
                    exact path="/punchQueen" 
                    render={(props) => <PunchQueen {...props} i18n={i18n} t={t} />}
                  />
                  <Route
                    exact path="/mCountdown" 
                    render={(props) => <MCountdownSpecialStageRanking {...props} i18n={i18n} t={t} />}
                  />
                  <Route
                    exact path="/concept" 
                    render={(props) => <ConceptDirectCamRanking {...props} i18n={i18n} t={t} />}
                  />
                  <Route
                    exact path="/conceptMusic" 
                    render={(props) => <ConceptMusicRanking {...props} i18n={i18n} t={t} />}
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
                    exaxt path="/d"
                    render={(props) => <DMenu {...props} i18n={i18n} t={t} />}
                  />
                  <Route
                    exaxt path="/d2"
                    render={(props) => <D2 {...props} i18n={i18n} t={t} />}
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