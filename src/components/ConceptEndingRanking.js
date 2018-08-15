import React, { Component } from 'react';
import axios from 'axios';
import { Icon, Menu, Message, Sticky } from 'semantic-ui-react';
import { sortBy, maxBy } from 'lodash';
import FlipMove from 'react-flip-move';
import LoadingContent from './LoadingContent';
import Music from './Music';
import ProgressBar from './ProgressBar';

const PATH_FETCH = 'https://a8qz9fc7k3.execute-api.ap-northeast-2.amazonaws.com/default/scanProduce48Concept';

const SORTS = {
  LIKE: list => sortBy(list, 'endingLike').reverse(),
  VIEW: list => sortBy(list, 'endingView').reverse(),
  COMMENT: list => sortBy(list, 'endingComment').reverse()
}

class ConceptEndingRanking extends Component {
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
      maxLike: maxBy(data, 'endingLike').endingLike,
      maxView: maxBy(data, 'endingView').endingView,
      maxComment: maxBy(data, 'endingComment').endingComment,
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

  handleContextRef = contextRef => this.setState({ contextRef });

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
      contextRef
    } = this.state;

    return (
      <div ref={this.handleContextRef}>
        <Message
          style={{ textAlign: 'center' }}
          attached
          header={t('concept-ending-title')}
          content={t('be-updated-every-five-minutes')}
        />
        <Sticky context={contextRef} offset={40}>
          <MenuBar
            t={t}
            activeItem={selectedMenu}
            onClickLike={this.onClickLike}
            onClickView={this.onClickView}
            onClickComment={this.onClickComment}
          />
        </Sticky>
        { isLoading
          ? <LoadingContent />
          : <FlipMove>
            {SORTS[sortKey](musicData).map(music => {
              let value, max;
              switch (sortKey) {
                case 'VIEW':
                  value = music.endingView;
                  max = maxView;
                  break;
                case 'COMMENT':
                  value = music.endingComment;
                  max = maxComment;
                  break;
                default:
                  value = music.endingLike;
                  max = maxLike;
              }
              return (
                <div key={music.id}>
                  <Music
                    i18n={i18n}
                    t={t}
                    music={music}
                    videoLink={music.endingUrl}
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

export default ConceptEndingRanking;