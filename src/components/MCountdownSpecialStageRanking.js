import React, { Component } from 'react';
import axios from 'axios';
import { Icon, Menu, Message } from 'semantic-ui-react';
import { sortBy, maxBy } from 'lodash';
import FlipMove from 'react-flip-move';
import LoadingContent from './LoadingContent';
import Music from './Music';
import ProgressBar from './ProgressBar';

const PATH_FETCH = 'data/produce48Concept.json';

const SORTS = {
  LIKE: list => sortBy(list, 'mCountdownLike').reverse(),
  VIEW: list => sortBy(list, 'mCountdownView').reverse(),
  COMMENT: list => sortBy(list, 'mCountdownComment').reverse()
}

class MCountdownSpecialStageRanking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      musicData: [],
      maxLike: 0,
      maxView: 0,
      maxComment: 0,
      selectedMenu: 'like',
      sortKey: 'LIKE',
      error: null,
      isLoading: false,
      indicating: true,
    };

    this.fetchConceptMusicData = this.fetchConceptMusicData.bind(this);
    this.setMusicData = this.setMusicData.bind(this);
    this.onClickLike = this.onClickLike.bind(this);
    this.onClickView = this.onClickView.bind(this);
    this.onClickComment = this.onClickComment.bind(this);
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
      maxLike: maxBy(data, 'mCountdownLike').mCountdownLike,
      maxView: maxBy(data, 'mCountdownView').mCountdownView,
      maxComment: maxBy(data, 'mCountdownComment').mCountdownComment,
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
      isLoading,
      indicating,
    } = this.state;

    return (
      <div>
        <Message
          style={{ textAlign: 'center' }}
          attached
          header={t('m-countdown-title')}
          content={t('last-updated')}
        />
        <MenuBar
          t={t}
          activeItem={selectedMenu}
          onClickLike={this.onClickLike}
          onClickView={this.onClickView}
          onClickComment={this.onClickComment}
        />
        { isLoading
          ? <LoadingContent />
          : <FlipMove>
            {SORTS[sortKey](musicData).map(music => {
              let value, max;
              switch (sortKey) {
                case 'VIEW':
                  value = music.mCountdownView;
                  max = maxView;
                  break;
                case 'COMMENT':
                  value = music.mCountdownComment;
                  max = maxComment;
                  break;
                default:
                  value = music.mCountdownLike;
                  max = maxLike;
              }
              return (
                <div key={music.id}>
                  <Music
                    i18n={i18n}
                    t={t}
                    music={music}
                    useMCountdownThumbnail={true}
                    videoLink={music.mCountdownSpecialStageUrl}
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
}) =>
  <Menu icon='labeled' attached fluid widths={3}>
    <Menu.Item
      name='like'
      active={activeItem === 'like'}
      onClick={onClickLike}
      color='pink'
    >
      <Icon name='like' />
      {t('heart')}
    </Menu.Item>
    <Menu.Item
      name='play'
      active={activeItem === 'view'}
      onClick={onClickView}
      color='pink'
    >
      <Icon name='play' />
      {t('play-count')}
    </Menu.Item>
    <Menu.Item
      name='comment'
      active={activeItem === 'comment'}
      onClick={onClickComment}
      color='pink'
    >
      <Icon name='comment' />
      {t('comment')}
    </Menu.Item>
  </Menu>

export default MCountdownSpecialStageRanking;