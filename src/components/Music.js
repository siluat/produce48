import React, { Component } from 'react';
import styled from 'styled-components';
import { Icon, Table, Popup, Segment, Label } from 'semantic-ui-react';
import moment from 'moment';

const MAIN_PICTURE_PATH = '/images/concept/';
const MCOUNTDOWN_PICTURE_PATH = '/images/mCountdown/';

const MusicContainer = styled.div`
  background-color: ${props => props.showRankChart ? '#f6f6f6' : '#f6f6f6'};
  position: relative;
  padding: 10px;
  min-height: 100px;
`

const MusicPictureContainer = styled.div`
  position: absolute;
`

const MusicPictureImage = styled.img`
  width: 72px;
  height: 72px;
  z-index: -10;
  border: 1px solid #ccc;
`

const MCountdownImage = styled.img`
  width: 72px;
  height: 41px;
  margin-top: 15px;
  z-index: -10;
  border: 1px solid #ccc;
`

const MusicDescriptionContainer = styled.div`
  display: inline-block;
  padding-top: 5px;
  padding-left: 80px;
  vertical-align: top;
  height: 72px;
  width: 100%;
`

const MusicLabelContainer = styled.div`
  vertical-align: top;
  padding-bottom: 5px;
`

const MusicTitle = styled.span`
  font-weight: bold;
  padding: 0 5px;
`

class Music extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showRankChart: false,
      showExtend: false,
    };

    this.onClick = this.onClick.bind(this);
    this.preventEventPropagation = this.preventEventPropagation.bind(this);
  }

  onClick() {
    this.setState({
      showExtend: !this.state.showExtend
    });
  }

  preventEventPropagation(event) {
    event.stopPropagation();
  }

  render() {
    const {
      i18n,
      t,
      music,
      videoLink,
      showChartRank,
      useMCountdownThumbnail,
      children
    } = this.props;

    const {
      showExtend
    } = this.state;

    return (
      <MusicContainer onClick={this.onClick} showExtend={showExtend}>
        <MusicPicture id={music.id} title={music.title} useMCountdownThumbnail={useMCountdownThumbnail}/>
        <MusicDescription
          i18n={i18n}
          t={t}
          title={music.title}
          titleInKorean={music.titleInkorean}
          titleInJapanese={music.titleInJapanese}
          videoLink={videoLink}
          preventEventPropagation={this.preventEventPropagation}
          children={children}
        />
        {
          (showChartRank)
            ? <RealtimeChartRank
                t={t}
                music={music}
              >
              </RealtimeChartRank>
            : null
        }
        {
          (showExtend)
            ? <Segment padded style={{ padding: 0 }}>
                <Label attached='top'>{music.artist}</Label>
                <img
                  style={{ width: '100%' }}
                  alt={music.artist}
                  src={MCOUNTDOWN_PICTURE_PATH + music.id + '.jpg'}
                />
              </Segment>
            : null
        }
      </MusicContainer>
    );
  }
}

const MusicPicture = ({ id, title, useMCountdownThumbnail }) =>
  <MusicPictureContainer>
    {
      useMCountdownThumbnail 
      ? <MCountdownImage
          alt={title}
          src={MCOUNTDOWN_PICTURE_PATH + id + '.jpg'}
        />
      : <MusicPictureImage
          alt={title}
          src={MAIN_PICTURE_PATH + id + '.png'}
        />
    }
    
  </MusicPictureContainer>

const MusicDescription = ({ 
  i18n,
  t,
  title,
  titleInKorean,
  titleInJapanese,
  videoLink,
  preventEventPropagation,
  children
}) =>
  <MusicDescriptionContainer>
    <MusicLabel
      i18n={i18n}
      t={t}
      title={title}
      titleInKorean={titleInKorean}
      titleInJapanese={titleInJapanese}
      videoLink={videoLink}
      preventEventPropagation={preventEventPropagation}
    />
    {children}
  </MusicDescriptionContainer>

const MusicLabel = ({
  i18n,
  t,
  title,
  titleInKorean,
  titleInJapanese,
  videoLink,
  preventEventPropagation
}) =>
  <MusicLabelContainer>
    {
      ((i18n.language === 'jp' || i18n.language === 'en') && titleInJapanese)
        ? <MusicTitle>{titleInJapanese}</MusicTitle>
        : <MusicTitle>{titleInKorean}</MusicTitle>
    }
    {
      (videoLink)
        ? <a onClick={preventEventPropagation} href={videoLink} target="_blank">
            <Icon name='video play'/>
          </a>
       : null
    }
  </MusicLabelContainer>

const RealtimeChartRank = ({
  t,
  music
}) =>
  <Table size='small' unstackable compact='very' textAlign='center'>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell />
        <Table.HeaderCell style={{ padding: '5px' }}>Melon</Table.HeaderCell>
        <Table.HeaderCell style={{ padding: '5px' }}>Genie</Table.HeaderCell>
        <Table.HeaderCell style={{ padding: '5px' }}>Naver</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row>
        <Table.Cell>{t('chart-realtime-rank')}</Table.Cell>
        <Table.Cell>
          {
            (music.melonRank)
              ? music.melonRank + t('rank')
              : t('out-of-chart')
          }
        </Table.Cell>
        <Table.Cell>
          {
            (music.genieRank)
              ? music.genieRank + t('rank')
              : t('out-of-chart')
          }
        </Table.Cell>
        <Table.Cell>
          {
            (music.naverRank)
              ? music.naverRank + t('rank')
              : t('out-of-chart')
          }
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{t('chart-best-rank')}</Table.Cell>
        <Table.Cell>
          {
            (music.melonBestRank)
              ? music.melonBestRank + t('rank')
              : '-'
          }
          &nbsp;
          <Popup
            trigger={<Icon name='clock outline' />}
            content={moment(music.melonBestRankTime).format('YYYY-MM-DD, h A')}
            inverted
            size='tiny'
            hideOnScroll
            on='hover'
          />
        </Table.Cell>
        <Table.Cell>
          {
            (music.genieBestRank)
              ? music.genieBestRank + t('rank')
              : '-'
          }
          &nbsp;
          <Popup
            trigger={<Icon name='clock outline' />}
            content={moment(music.genieBestRankTime).format('YYYY-MM-DD, h A')}
            inverted
            size='tiny'
            hideOnScroll
            on='hover'
          />
        </Table.Cell>
        <Table.Cell>
          {
            (music.naverBestRank)
              ? music.naverBestRank + t('rank')
              : '-'
          }
          &nbsp;
          <Popup
            trigger={<Icon name='clock outline' />}
            content={moment(music.naverBestRankTime).format('YYYY-MM-DD, h A')}
            inverted
            size='tiny'
            hideOnScroll
            on='hover'
          />
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>

export default Music;