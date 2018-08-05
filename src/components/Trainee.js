import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Icon, Label } from 'semantic-ui-react';
import { ResponsiveContainer, LineChart, Line, XAxis, LabelList, YAxis } from 'recharts';


const MAIN_PICTURE_PATH = '/images/mainPictures/144px/';

const TraineeContainer = styled.div`
  background-color: ${props => props.showRankChart ? '#f6f6f6' : '#f6f6f6'};
  position: relative;
  padding: 10px;
  min-height: 100px;
`

const TraineePictureContainer = styled.div`
  position: absolute;
`

const TraineePictureMask = styled.span`
  position: absolute;
  width: 72px;
  height: 72px;
  background: url('/images/mask_line72.png') 0 0 no-repeat;
`

const TraineePictureImage = styled.img`
  width: 72px;
  height: 72px;
  z-index: -10;
`

const TraineeDescriptionContainer = styled.div`
  display: inline-block;
  padding-top: 5px;
  padding-left: 80px;
  vertical-align: top;
  height: 72px;
  width: 100%;
`

const TraineeLabelContainer = styled.div`
  vertical-align: top;
  padding-bottom: 5px;
`

const TraineeRank = styled.span`
  font-weight: bold;
  color: #ff50a1;
  :last-child {
    margin-left: -5px;
  }
`

const TraineeName = styled.span`
  font-weight: bold;
  padding: 0 5px;
`

const RankChartContainer = styled.div`
  margin-top: 10px;
`

class Trainee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showRankChart: false
    };

    this.onClick = this.onClick.bind(this);
    this.preventEventPropagation = this.preventEventPropagation.bind(this);
  }

  onClick() {
    this.setState({
      showRankChart: !this.state.showRankChart
    });
  }

  preventEventPropagation(event) {
    event.stopPropagation();
  }

  render() {
    const {
      id,
      name,
      week1Rank,
      week2Rank,
      week3Rank,
      week4Rank,
      week7Rank,
      lastRank,
      videoLink,
      gardenIdx,
      gardenHugStepLastDate,
      children 
    } = this.props;

    const {
      showRankChart
    } = this.state;

    const data = [
      { name: '1주차', rank: week1Rank },
      { name: '2주차', rank: week2Rank },
      { name: '3주차', rank: week3Rank },
      { name: '4주차', rank: week4Rank },
      { name: '7주차', rank: week7Rank },
    ];

    return (
      <TraineeContainer onClick={this.onClick} showRankChart={showRankChart}>
        <TraineePicture id={id} name={name}/>
        <TraineeDescription 
          name={name}
          week4Rank={week4Rank}
          week7Rank={week7Rank}
          lastRank={lastRank}
          videoLink={videoLink}
          gardenLink={gardenIdx}
          stepUpToday={(gardenHugStepLastDate === moment().format('YYYY-MM-DD') ? true : false) }
          preventEventPropagation={this.preventEventPropagation}
          children={children}
        />
        {
          (showRankChart)
            ? <RankChartContainer>
                <ResponsiveContainer 
                  height={100}
                >
                <LineChart 
                  data={data} 
                  margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
                  padding={{ left: 10, right: 10 }}
                >
                  <Line
                    type='monotone'
                    dataKey='rank'
                    stroke='#ff50a0'
                    animationDuration={500}
                  >
                    <LabelList dataKey='rank' position='top'/>
                  </Line>
                  <XAxis dataKey='name' />
                  <YAxis reversed={true} hide={true}/>
                </LineChart>
                </ResponsiveContainer>
              </RankChartContainer>
            : null
        }
      </TraineeContainer>
    );
  }
}

const TraineePicture = ({ id, name }) =>
  <TraineePictureContainer>
    <TraineePictureMask />
    <TraineePictureImage
      alt={name}
      src={MAIN_PICTURE_PATH + id + '.jpg'}
    />
  </TraineePictureContainer>

const TraineeDescription = ({ 
  name, 
  week4Rank,
  week7Rank,
  lastRank,
  videoLink,
  gardenLink,
  stepUpToday,
  preventEventPropagation,
  children
}) =>
  <TraineeDescriptionContainer>
    <TraineeLabel 
      name={name}
      week4Rank={week4Rank}
      week7Rank={week7Rank}
      lastRank={lastRank}
      videoLink={videoLink}
      gardenLink={gardenLink}
      stepUpToday={stepUpToday}
      preventEventPropagation={preventEventPropagation}
    />
    {children}
  </TraineeDescriptionContainer>

const TraineeLabel = ({ 
  name,
  lastRank,
  videoLink,
  gardenLink, 
  stepUpToday,
  preventEventPropagation
}) =>
  <TraineeLabelContainer>
    <TraineeRank>{lastRank}</TraineeRank>
    <TraineeName>{name}</TraineeName>
    {
      (videoLink)
        ? <a onClick={preventEventPropagation} href={videoLink} target="_blank">
            <Icon name='video play'/>
          </a>
       : null
    }
    {
      (gardenLink) 
        ? <a onClick={preventEventPropagation} href={'https://produce48.kr/m48_detail.php?idx=' + gardenLink + '&cate=hug'} target="_blank">
            <Icon name='external'/>
          </a>
        : null
    }
    {
      (stepUpToday)
        ? <Label basic pointing='left' size='mini'>
            오늘 상승!
          </Label>
        : null
    }
  </TraineeLabelContainer>

export default Trainee;