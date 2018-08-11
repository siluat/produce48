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
  LIKE: list => sortBy(list, 'specialClipLike').reverse(),
  TWITTER_LIKE: list => sortBy(list, 'specialClipTwitterLike').reverse(),
  VIEW: list => sortBy(list, 'specialClipView').reverse(),
  COMMENT: list => sortBy(list, 'specialClipComment').reverse()
}

const positionFilter = item => {
  return item.specialClipUrl;
}

class SpecialClipRanking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      traineeData: [],
      maxLike: 0,
      maxTwitterLike: 0,
      maxView: 0,
      maxComment: 0,
      selectedMenu: 'like',
      sortKey: 'LIKE',
      error: null,
      isLoading: false,
      indicating: true,
    };

    this.fetchTraineeData = this.fetchTraineeData.bind(this);
    this.setTraineeData = this.setTraineeData.bind(this);
    this.onClickLike = this.onClickLike.bind(this);
    this.onClickTwitterLike = this.onClickTwitterLike.bind(this);
    this.onClickView = this.onClickView.bind(this);
    this.onClickComment = this.onClickComment.bind(this);
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
      maxLike: maxBy(data, 'specialClipLike').specialClipLike,
      maxTwitterLike: maxBy(data, 'specialClipTwitterLike').specialClipTwitterLike,
      maxView: maxBy(data, 'specialClipView').specialClipView,
      maxComment: maxBy(data, 'specialClipComment').specialClipComment,
    });
  }

  onClickLike() {
    this.setState({ selectedMenu: 'like' });
    this.setState({ sortKey: 'LIKE' });
    this.setState({ indicating: true });
  }

  onClickTwitterLike() {
    this.setState({ selectedMenu: 'twitterLike' });
    this.setState({ sortKey: 'TWITTER_LIKE' });
    this.setState({ indicating: true });
  }

  onClickView() {
    this.setState({ selectedMenu: 'view' });
    this.setState({ sortKey: 'VIEW' });
    this.setState({ indicating: true });
  }

  onClickComment() {
    this.setState({ selectedMenu: 'comment' });
    this.setState({ sortKey: 'COMMENT' });
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
      maxLike,
      maxTwitterLike,
      maxView,
      maxComment,
      isLoading,
      indicating,
      contextRef
    } = this.state;

    return (
      <div ref={this.handleContextRef}>
        <Message
          style={{ textAlign: 'center' }}
          attached
          header={t('special-title')}
          content={t('be-updated-every-five-minutes')}
        />
        <Sticky context={contextRef} offset={40}>
          <Message 
            color='pink'
            style={{ textAlign: 'center' }}
            attached
            header={t('vote-your-girl')}
          />
        </Sticky>
        <Sticky context={contextRef} offset={84}>
          <MenuBar
            t={t}
            activeItem={selectedMenu}
            onClickLike={this.onClickLike}
            onClickTwitterLike={this.onClickTwitterLike}
            onClickView={this.onClickView}
            onClickComment={this.onClickComment}
          />
        </Sticky>
        { isLoading
          ? <LoadingContent />
          : <FlipMove>
            {SORTS[sortKey](traineeData.filter(positionFilter)).map(trainee => {
              let value, max;
              switch (sortKey) {
                case 'TWITTER_LIKE':
                  value = trainee.specialClipTwitterLike;
                  max = maxTwitterLike;
                  break;
                case 'VIEW':
                  value = trainee.specialClipView;
                  max = maxView;
                  break;
                case 'COMMENT':
                  value = trainee.specialClipComment;
                  max = maxComment;
                  break;
                default:
                  value = trainee.specialClipLike;
                  max = maxLike;
              }
              return (
                <div key={trainee.id}>
                  <Trainee
                    i18n={i18n}
                    t={t}
                    trainee={trainee}
                    videoLink={trainee.specialClipUrl}
                    videoTwitterLink={trainee.specialClipTwitterUrl}
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
  onClickLike,
  onClickTwitterLike,
  onClickView,
  onClickComment,
}) =>
  <Menu icon='labeled' attached fluid widths={4}>
    <Menu.Item
      name='like'
      active={activeItem === 'like'}
      onClick={onClickLike}>
      <Icon name='like' />
      {t('clip-nc-heart')}
    </Menu.Item>
    <Menu.Item
      name='twitterLike'
      active={activeItem === 'twitterLike'}
      onClick={onClickTwitterLike}>
      <Icon name='like' />
      {t('clip-twitter-heart')}
    </Menu.Item>
    <Menu.Item
      name='play'
      active={activeItem === 'view'}
      onClick={onClickView}>
      <Icon name='play' />
      {t('clip-play')}
    </Menu.Item>
    <Menu.Item
      name='comment'
      active={activeItem === 'comment'}
      onClick={onClickComment}
    >
      <Icon name='comment' />
      {t('clip-comment')}
    </Menu.Item>
  </Menu>

export default SpecialClipRanking;