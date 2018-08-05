import React, { Component } from 'react';
import axios from 'axios';
import { Icon, Menu, Message } from 'semantic-ui-react';
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

  render() {
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
    } = this.state;

    return (
      <div>
        <Message
          style={{ textAlign: 'center' }}
          attached
          header='프로듀스48 그룹 배틀 항목별 순위'
          content='5분마다 최신 정보로 업데이트됩니다.'
        />
        <MenuBar
          activeItem={selectedMenu}
          onClickLike={this.onClickLike}
          onClickView={this.onClickView}
          onClickComment={this.onClickComment}
          onClickVote={this.onClickVote}
        />
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
                    id={trainee.id}
                    name={trainee.name}
                    week1Rank={trainee.week1Rank}
                    week2Rank={trainee.week2Rank}
                    week3Rank={trainee.week3Rank}
                    week4Rank={trainee.week4Rank}
                    week7Rank={trainee.week7Rank}
                    lastRank={trainee.lastRank}
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
      onClick={onClickLike}>
      <Icon name='like' />
      직캠하트
    </Menu.Item>
    <Menu.Item
      name='play'
      active={activeItem === 'view'}
      onClick={onClickView}>
      <Icon name='play' />
      직캠조회
    </Menu.Item>
    <Menu.Item
      name='comment'
      active={activeItem === 'comment'}
      onClick={onClickComment}
    >
      <Icon name='comment' />
      직캠댓글
    </Menu.Item>
    <Menu.Item
      name='vote'
      active={activeItem === 'vote'}
      onClick={onClickVote}
    >
      <Icon name='check square' />
      현장투표
    </Menu.Item>
  </Menu>

export default GroupBattleCamRanking;