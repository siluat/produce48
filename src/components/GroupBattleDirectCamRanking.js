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
  LIKE: list => sortBy(list, 'groupBattleLike').reverse(),
  VIEW: list => sortBy(list, 'groupBattleView').reverse(),
  COMMENT: list => sortBy(list, 'groupBattleComment').reverse(),
  VOTE: list => sortBy(
    list.filter(item => { return item.groupBattleVote !== 0 })
    , 'groupBattleVote').reverse(),
}

const groupBattleFilter = item => {
  return item.groupBattleDirectCamUrl;
}

class GroupBattleCamRanking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      traineeData: [],
      maxLike: 0,
      maxView: 0,
      maxComment: 0,
      maxVote: 0,
      selectedMenu: 'like',
      sortKey: 'LIKE',
      error: null,
      isLoading: false,
      indicating: true,
    };

    this.fetchTraineeData = this.fetchTraineeData.bind(this);
    this.setTraineeData = this.setTraineeData.bind(this);
    this.onClickLike = this.onClickLike.bind(this);
    this.onClickView = this.onClickView.bind(this);
    this.onClickComment = this.onClickComment.bind(this);
    this.onClickVote = this.onClickVote.bind(this);
  }

  componentDidMount() {
    this.fetchTraineeData();
  }

  componentDidUpdate() {
    const progresses = document.querySelectorAll('.bar .progress, .outer-value');

    for (let i = 0; i < progresses.length; i++) {
      let t = progresses[i].textContent;
      progresses[i].textContent = t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
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
      maxLike: maxBy(data, 'groupBattleLike').groupBattleLike,
      maxView: maxBy(data, 'groupBattleView').groupBattleView,
      maxComment: maxBy(data, 'groupBattleComment').groupBattleComment,
      maxVote: maxBy(data, 'groupBattleVote').groupBattleVote,
    });
  }

  onClickLike() {
    this.setState({ selectedMenu: 'like' });
    this.setState({ sortKey: 'LIKE' });
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

  onClickVote() {
    this.setState({ selectedMenu: 'vote' });
    this.setState({ sortKey: 'VOTE' });
    this.setState({ indicating: false });
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
      maxView,
      maxComment,
      maxVote,
      isLoading,
      indicating,
      contextRef
    } = this.state;

    return (
      <div ref={this.handleContextRef}>
        <Message
          style={{ textAlign: 'center' }}
          attached
          header={t('group-title')}
          content={t('be-updated-every-1-hour')}
        />
        <Sticky context={contextRef} offset={40}>
          <MenuBar
            t={t}
            activeItem={selectedMenu}
            onClickLike={this.onClickLike}
            onClickView={this.onClickView}
            onClickComment={this.onClickComment}
            onClickVote={this.onClickVote}
          />
        </Sticky>
        { isLoading
          ? <LoadingContent />
          : <FlipMove>
            {SORTS[sortKey](traineeData.filter(groupBattleFilter)).map(trainee => {
              let value, max;
              switch (sortKey) {
                case 'VIEW':
                  value = trainee.groupBattleView;
                  max = maxView;
                  break;
                case 'COMMENT':
                  value = trainee.groupBattleComment;
                  max = maxComment;
                  break;
                case 'VOTE':
                  value = trainee.groupBattleVote;
                  max = maxVote;
                  break;
                default:
                  value = trainee.groupBattleLike;
                  max = maxLike;
              }
              return (
                <div key={trainee.id}>
                  <Trainee
                    i18n={i18n}
                    t={t}
                    trainee={trainee}
                    id={trainee.id}
                    videoLink={trainee.groupBattleDirectCamUrl}
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
  onClickView,
  onClickComment,
  onClickVote,
}) =>
  <Menu icon='labeled' attached fluid widths={4}>
    <Menu.Item
      name='like'
      active={activeItem === 'like'}
      onClick={onClickLike}
      color='pink'
    >
      <Icon name='like' />
      {t('direct-cam-heart')}
    </Menu.Item>
    <Menu.Item
      name='play'
      active={activeItem === 'view'}
      onClick={onClickView}
      color='pink'
    >
      <Icon name='play' />
      {t('direct-cam-play')}
    </Menu.Item>
    <Menu.Item
      name='comment'
      active={activeItem === 'comment'}
      onClick={onClickComment}
      color='pink'
    >
      <Icon name='comment' />
      {t('direct-cam-comment')}
    </Menu.Item>
    <Menu.Item
      name='vote'
      active={activeItem === 'vote'}
      onClick={onClickVote}
      color='pink'
    >
      <Icon name='check square' />
      {t('offline-vote')}
    </Menu.Item>
  </Menu>

export default GroupBattleCamRanking;