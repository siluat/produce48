import React, { Component } from 'react';
import axios from 'axios';
import { Icon, Menu, Progress, Message, Loader, Segment, Image, Dimmer } from 'semantic-ui-react';
import { sortBy, maxBy } from 'lodash';
import FlipMove from 'react-flip-move';
import './DirectCamRanking.css';

const MAIN_PICTURE_PATH = '/images/mainPictures/';
const PATH_FETCH = 'https://a8qz9fc7k3.execute-api.ap-northeast-2.amazonaws.com/default/scanProduce48';

const SORTS = {
  LIKE: list => sortBy(list, 'groupBattleLike').reverse(),
  VIEW: list => sortBy(list, 'groupBattleView').reverse(),
  COMMENT: list => sortBy(list, 'groupBattleComment').reverse(),
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
      selectedMenu: 'like',
      sortKey: 'LIKE',
      error: null,
      isLoading: false,
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
      maxLike: maxBy(data, 'groupBattleLike').groupBattleLike,
      maxView: maxBy(data, 'groupBattleView').groupBattleView,
      maxComment: maxBy(data, 'groupBattleComment').groupBattleComment,
    });
  }

  onClickLike() {
    this.setState({ selectedMenu: 'like' });
    this.setState({ sortKey: 'LIKE' });
  }

  onClickView() {
    this.setState({ selectedMenu: 'view' });
    this.setState({ sortKey: 'VIEW' });
  }

  onClickComment() {
    this.setState({ selectedMenu: 'comment' });
    this.setState({ sortKey: 'COMMENT' });
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
    } = this.state;

    return (
      <div>
        <Message
          className='top-message'
          attached
          header='프로듀스48 그룹 배틀 항목별 순위'
          content='5분마다 최신 정보로 업데이트합니다.'
        />
        <MenuBar
          activeItem={selectedMenu}
          onClickLike={this.onClickLike}
          onClickView={this.onClickView}
          onClickComment={this.onClickComment}
        />
        { isLoading
          ? <Segment>
              <Dimmer active inverted>
                <Loader size='large'>Loading</Loader>
              </Dimmer>
        
              <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
            </Segment>
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
                default:
                  value = trainee.groupBattleLike;
                  max = maxLike;
              }
              return (
                <div key={trainee.id} className='trainee-info'>
                  <span className='progress-wrapper'>
                    <span className='trainee-picture-mask'>
                    </span>
                    <img 
                      className='trainee-picture'
                      alt={trainee.name}
                      src={MAIN_PICTURE_PATH + trainee.id + '.jpg'}
                    />
                    <span className='trainee-name-group'>
                      <span className='trainee-name'>{trainee.name}</span>
                      <span className='trainee-name-in-english'>{trainee.nameInEnglish}</span>
                      <a href={trainee.groupBattleDirectCamUrl}><Icon name='video play'/></a>
                    </span>
                    <SmartProgress value={value} max={max} />
                  </span>
                </div>
              )})
            }
          </FlipMove>
        }
        <Message attached='bottom'>
          <Icon name='mail' />
          pick.the.nako@gmail.com
        </Message>
      </div>
    )
  }
}

const MenuBar = ({ 
  activeItem,
  onClickLike,
  onClickView,
  onClickComment
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

const SmartProgress = ({
  value,
  max
}) => {
  if (value / max > 0.23) {
    return (
      <div>
        <div>
          <Progress
            style={{ paddingLeft: '80px', marginTop: '5px' }}
            size='large'
            value={value}
            total={max}
            inverted color='pink'
            progress='value'
            indicating
          />
        </div>
      </div>
    )
  } else if (value / max > 0.11) {
    return (
      <div>
        <div>
          <Progress
            style={{ paddingLeft: '80px', marginTop: '5px' }}
            size='large'
            value={value}
            total={max}
            inverted color='pink'
            indicating
          />
        </div>
        <div className='outer-value' style={{ paddingLeft: (value / max * 100) + '%' }}>{value}</div>
      </div>
    )
  } else {
    return (
      <div>
        <div>
          <Progress
            style={{ paddingLeft: '80px', marginTop: '5px' }}
            size='large'
            value={value}
            total={max}
            inverted color='pink'
            indicating
          />
        </div>
        <div className='outer-value' style={{ paddingLeft: '11%' }}>{value}</div>
      </div>
    )
  }
}
export default GroupBattleCamRanking;