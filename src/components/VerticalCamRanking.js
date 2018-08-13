import React, { Component } from 'react';
import axios from 'axios';
import { Icon, Menu, Message, Sticky } from 'semantic-ui-react';
import { sortBy, maxBy } from 'lodash';
import FlipMove from 'react-flip-move';

import LoadingContent from './LoadingContent';
import Trainee from './Trainee';
import ProgressBar from './ProgressBar';

const PATH_FETCH = 'https://a8qz9fc7k3.execute-api.ap-northeast-2.amazonaws.com/default/scanProduce48';

const SORTS = {
  TWITTER_LIKE: list => sortBy(list, 'verticalCamTwitterLike').reverse(),
  FACEBOOK_LIKE: list => sortBy(list, 'verticalCamFacebookLike').reverse(),
}

const emptyUrlFilter = item => {
  return item.verticalCamTwitterUrl;
}

class VerticalCamRanking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      traineeData: [],
      maxTwitterLike: 0,
      maxFacebookLike: 0,
      selectedMenu: 'twitterLike',
      sortKey: 'TWITTER_LIKE',
      error: null,
      isLoading: false,
      indicating: true,
    };

    this.fetchTraineeData = this.fetchTraineeData.bind(this);
    this.setTraineeData = this.setTraineeData.bind(this);
    this.onClickTwitterLike = this.onClickTwitterLike.bind(this);
    this.onClickFacebookLike = this.onClickFacebookLike.bind(this);
  }

  componentDidMount() {
    this.fetchTraineeData();

    this.interval = setInterval(() => {
      axios(`${PATH_FETCH}`)
      .then(result => this.setTraineeData(result.data.items))
      .catch(error => this.setState({ error }));
    }, 1000 * 60 * 5);
  }

  componentDidUpdate() {
    const progresses = document.querySelectorAll('.bar .progress, .outer-value');

    for (let i = 0; i < progresses.length; i++) {
      let t = progresses[i].textContent;
      progresses[i].textContent = t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchTraineeData() {
    this.setState({ isLoading: true });
    
    axios(`${PATH_FETCH}`)
      .then(result => this.setTraineeData(result.data.items))
      .catch(error => this.setState({ error }));
  }

  setTraineeData(data) {
    this.setState({
      traineeData: data,
      isLoading: false,
      maxTwitterLike: maxBy(data, 'verticalCamTwitterLike').verticalCamTwitterLike,
      maxFacebookLike: maxBy(data, 'verticalCamFacebookLike').verticalCamFacebookLike,
    });
  }

  onClickTwitterLike() {
    this.setState({ selectedMenu: 'twitterLike' });
    this.setState({ sortKey: 'TWITTER_LIKE' });
    this.setState({ indicating: true });
  }

  onClickFacebookLike() {
    this.setState({ selectedMenu: 'facebookLike' });
    this.setState({ sortKey: 'FACEBOOK_LIKE' });
    this.setState({ indicating: true });
  }

  handleContextRef = contextRef => this.setState({ contextRef });

  render() {
    const {
      i18n,
      t
    } = this.props;

    const {
      traineeData,
      selectedMenu,
      sortKey,
      maxTwitterLike,
      maxFacebookLike,
      isLoading,
      indicating,
      contextRef
    } = this.state;

    return (
      <div ref={this.handleContextRef}>
        <Message
          style={{ textAlign: 'center' }}
          attached
          header={t('vertical-cam-title')}
          content={t('be-updated-every-five-minutes')}
        />
        <Sticky context={contextRef} offset={39}>
          <Message 
            color='pink'
            style={{ textAlign: 'center' }}
            attached
            header={t('vote-your-girl')}
          />
        </Sticky>
        <Sticky context={contextRef} offset={83}>
          <MenuBar
            t={t}
            activeItem={selectedMenu}
            onClickTwitterLike={this.onClickTwitterLike}
            onClickFacebookLike={this.onClickFacebookLike}
          />
        </Sticky>
        { isLoading
          ? <LoadingContent />
          : <FlipMove>
            {
              SORTS[sortKey](traineeData.filter(emptyUrlFilter)).map(trainee => {
                let value, max;
                switch (sortKey) {
                  case 'FACEBOOK_LIKE':
                    value = trainee.verticalCamFacebookLike;
                    max = maxFacebookLike;
                    break;
                  default:
                    value = trainee.verticalCamTwitterLike;
                    max = maxTwitterLike;
              }
              return (
                <div key={trainee.id}>
                  <Trainee
                    i18n={i18n}
                    t={t}
                    trainee={trainee}
                    videoTwitterLink={trainee.verticalCamTwitterUrl}
                    videoFacebookLink={trainee.verticalCamFacebookUrl}
                  >
                    <ProgressBar value={value} max={max} indicating={indicating} />
                  </Trainee>
                </div>
              )})
            }
          </FlipMove>
        }
      </div>
    )
  }
}

const MenuBar = ({
  t,
  activeItem,
  onClickTwitterLike,
  onClickFacebookLike,
}) =>
  <Menu icon='labeled' attached fluid widths={2}>
    <Menu.Item
      name='twitterLike'
      active={activeItem === 'twitterLike'}
      onClick={onClickTwitterLike}
      color='pink'
    >
      <Icon name='like' />
      {t('clip-twitter-heart')}
    </Menu.Item>
    <Menu.Item
      name='facebookLike'
      active={activeItem === 'facebookLike'}
      onClick={onClickFacebookLike}
      color='pink'
    >
      <Icon name='thumbs up' />
      {t('clip-facebook-like')}
    </Menu.Item>
  </Menu>

export default VerticalCamRanking;