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
  LIKE: list => sortBy(list, 'nekkoyaLike').reverse(),
  VIEW: list => sortBy(list, 'nekkoyaView').reverse(),
  COMMENT: list => sortBy(list, 'nekkoyaComment').reverse()
}

const positionFilter = item => {
  return item.nekkoyaDirectCamUrl;
}

class NekkoyaDirectCamRanking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      traineeData: [],
      maxLike: 0,
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
    this.onClickView = this.onClickView.bind(this);
    this.onClickComment = this.onClickComment.bind(this);
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
      maxLike: maxBy(data, 'nekkoyaLike').nekkoyaLike,
      maxView: maxBy(data, 'nekkoyaView').nekkoyaView,
      maxComment: maxBy(data, 'nekkoyaComment').nekkoyaComment,
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

  render() {
    const {
      traineeData,
      selectedMenu,
      sortKey,
      maxLike,
      maxView,
      maxComment,
      isLoading,
      indicating,
    } = this.state;

    return (
      <div>
        <Message
          style={{ textAlign: 'center' }}
          attached
          header='프로듀스48 내꺼야 직캠 항목별 순위'
          content='5분마다 최신 정보로 업데이트됩니다.'
        />
        <MenuBar
          activeItem={selectedMenu}
          onClickLike={this.onClickLike}
          onClickView={this.onClickView}
          onClickComment={this.onClickComment}
        />
        { isLoading
          ? <LoadingContent />
          : <FlipMove>
            {SORTS[sortKey](traineeData.filter(positionFilter)).map(trainee => {
              let value, max;
              switch (sortKey) {
                case 'VIEW':
                  value = trainee.nekkoyaView;
                  max = maxView;
                  break;
                case 'COMMENT':
                  value = trainee.nekkoyaComment;
                  max = maxComment;
                  break;
                default:
                  value = trainee.nekkoyaLike;
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
                    videoLink={trainee.nekkoyaDirectCamUrl}
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
}) =>
  <Menu icon='labeled' attached fluid widths={3}>
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
  </Menu>

export default NekkoyaDirectCamRanking;