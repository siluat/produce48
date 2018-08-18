import React, { Component } from 'react';
import styled from 'styled-components';
import { Icon, Table } from 'semantic-ui-react';

const MAIN_PICTURE_PATH = '/images/concept/';

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
      showRankChart: false
    };

    this.onClick = this.onClick.bind(this);
    this.preventEventPropagation = this.preventEventPropagation.bind(this);
  }

  onClick() {
    // this.setState({
    //   showRankChart: !this.state.showRankChart
    // });
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
      children
    } = this.props;

    const {
      showRankChart
    } = this.state;

    return (
      <MusicContainer onClick={this.onClick} showRankChart={showRankChart}>
        <MusicPicture id={music.id} title={music.title}/>
        <MusicDescription
          i18n={i18n}
          t={t}
          title={music.title}
          titleInJapanese={music.titleInJapanese}
          videoLink={videoLink}
          preventEventPropagation={this.preventEventPropagation}
          children={children}
        />
        {
          (showChartRank)
            ? <RealtimeChartRank
                t={t}
                melonRank={music.melonRank}
                genieRank={music.genieRank}
                naverRank={music.naverRank}
              >
              </RealtimeChartRank>
            : null
        }
      </MusicContainer>
    );
  }
}

const MusicPicture = ({ id, title }) =>
  <MusicPictureContainer>
    <MusicPictureImage
      alt={title}
      src={MAIN_PICTURE_PATH + id + '.png'}
    />
  </MusicPictureContainer>

const MusicDescription = ({ 
  i18n,
  t,
  title,
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
  titleInJapanese,
  videoLink,
  preventEventPropagation
}) =>
  <MusicLabelContainer>
    {
      (i18n.language === 'jp' && titleInJapanese)
        ? <MusicTitle>{titleInJapanese}</MusicTitle>
        : <MusicTitle>{title}</MusicTitle>
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
  melonRank,
  genieRank,
  naverRank
}) =>
  <Table size='small' unstackable compact='very' textAlign='center'>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell style={{ padding: '5px' }}>Melon</Table.HeaderCell>
        <Table.HeaderCell style={{ padding: '5px' }}>Genie</Table.HeaderCell>
        <Table.HeaderCell style={{ padding: '5px' }}>Naver</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row>
        <Table.Cell>
          {
            (melonRank)
              ? melonRank + t('rank')
              : '-'
          }
        </Table.Cell>
        <Table.Cell>
          {
            (genieRank)
              ? genieRank + t('rank')
              : '-'
          }
        </Table.Cell>
        <Table.Cell>
          {
            (naverRank)
              ? naverRank + t('rank')
              : '-'
          }
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>

export default Music;