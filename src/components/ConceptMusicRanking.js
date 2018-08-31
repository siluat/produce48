import React, { Component } from 'react';
import axios from 'axios';
import { Icon, Menu, Message } from 'semantic-ui-react';
import { sortBy, maxBy } from 'lodash';
import FlipMove from 'react-flip-move';
import LoadingContent from './LoadingContent';
import Music from './Music';
import ProgressBar from './ProgressBar';

const PATH_FETCH = 'https://a8qz9fc7k3.execute-api.ap-northeast-2.amazonaws.com/default/scanProduce48Concept';

const SORTS = {
  LIKE: list => sortBy(list, 'conceptEvalLike').reverse(),
  VIEW: list => sortBy(list, 'conceptEvalView').reverse(),
  COMMENT: list => sortBy(list, 'conceptEvalComment').reverse(),
  VOTE: list => sortBy(
    list.filter(item => { return item.conceptTeamVote !== 0 })
    , 'conceptTeamVote').reverse(),
}

class ConceptMusicRanking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      musicData: [],
      maxLike: 0,
      maxView: 0,
      maxComment: 0,
      maxVote: 0,
      selectedMenu: 'like',
      sortKey: 'LIKE',
      error: null,
      isLoading: false,
      indicating: true,
      showChartRank: false
    };

    this.fetchConceptMusicData = this.fetchConceptMusicData.bind(this);
    this.setMusicData = this.setMusicData.bind(this);
    this.onClickLike = this.onClickLike.bind(this);
    this.onClickView = this.onClickView.bind(this);
    this.onClickComment = this.onClickComment.bind(this);
    this.onClickVote = this.onClickVote.bind(this);
    this.onClickShowChartRank = this.onClickShowChartRank.bind(this);
  }

  componentDidMount() {
    this.fetchConceptMusicData();

    this.interval = setInterval(() => {
      axios(`${PATH_FETCH}`)
      .then(result => this.setMusicData(result.data.items))
      .catch(error => this.setState({ error }));
    }, 1000 * 60);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate() {
    const progresses = document.querySelectorAll('.bar .progress, .outer-value');

    for (let i = 0; i < progresses.length; i++) {
      let t = progresses[i].textContent;
      progresses[i].textContent = t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

  fetchConceptMusicData() {
    this.setState({ isLoading: true });
    
    axios(`${PATH_FETCH}`)
      .then(result => this.setMusicData(result.data.items))
      .catch(error => this.setState({ error }));
  }

  setMusicData(data) {
    this.setState({
      musicData: data,
      isLoading: false,
      maxLike: maxBy(data, 'conceptEvalLike').conceptEvalLike,
      maxView: maxBy(data, 'conceptEvalView').conceptEvalView,
      maxComment: maxBy(data, 'conceptEvalComment').conceptEvalComment,
      maxVote: maxBy(data, 'conceptTeamVote').conceptTeamVote,
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

  onClickShowChartRank() {
    this.setState({
      showChartRank: !this.state.showChartRank
    });
  }

  render() {
    const {
      i18n,
      t
    } = this.props;

    const {
      musicData,
      selectedMenu,
      sortKey,
      maxLike,
      maxView,
      maxComment,
      maxVote,
      isLoading,
      indicating,
      showChartRank,
    } = this.state;

    return (
      <div>
        <Message
          style={{ textAlign: 'center' }}
          attached
          header={t('concept-music-title')}
          content={t('last-updated')}
        />
        <MenuBar
          t={t}
          activeItem={selectedMenu}
          onClickLike={this.onClickLike}
          onClickView={this.onClickView}
          onClickComment={this.onClickComment}
          onClickVote={this.onClickVote}
        />
        {/* <Menu icon attached widths={1}>
          <Menu.Item name='gamepad' onClick={this.onClickShowChartRank}>
            <Icon name='chart line' />
            &nbsp;&nbsp;
            {
              (showChartRank)
                ? t('hide-realtime-chart')
                : t('show-realtime-chart')
            }
          </Menu.Item>
        </Menu> */}
        { isLoading
          ? <LoadingContent />
          : <FlipMove>
            {SORTS[sortKey](musicData).map(music => {
              let value, max;
              switch (sortKey) {
                case 'VIEW':
                  value = music.conceptEvalView;
                  max = maxView;
                  break;
                case 'COMMENT':
                  value = music.conceptEvalComment;
                  max = maxComment;
                  break;
                case 'VOTE':
                  value = music.conceptTeamVote;
                  max = maxVote;
                  break;
                default:
                  value = music.conceptEvalLike;
                  max = maxLike;
              }
              return (
                <div key={music.id}>
                  <Music
                    i18n={i18n}
                    t={t}
                    music={music}
                    videoLink={music.conceptEvalUrl}
                    showChartRank={showChartRank}
                  >
                    <ProgressBar value={value} max={max} indicating={indicating} />
                  </Music>
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
  onClickVote
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

export default ConceptMusicRanking;