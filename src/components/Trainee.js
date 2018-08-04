import React from 'react';
import styled from 'styled-components';
import { Icon, Label } from 'semantic-ui-react';
import moment from 'moment';

const MAIN_PICTURE_PATH = '/images/mainPictures/144px/';

const TraineeContainer = styled.div`
  background-color: #f6f6f6;
  position: relative;
  padding: 10px;
  height: 100px;
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
  width: 100%;
`

const TraineeLabelContainer = styled.div`
  vertical-align: top;
  padding-bottom: 5px;
`

const TraineeRank = styled.span`
  font-weight: bold;
  color: #ff50a1;
`

const TraineeName = styled.span`
  font-weight: bold;
  padding: 0 5px;
`

const Trainee = ({ 
  id,
  name,
  lastRank,
  videoLink,
  gardenIdx,
  gardenHugStepLastDate,
  children 
}) =>
  <TraineeContainer>
    <TraineePicture id={id} name={name}/>
    <TraineeDescription 
      name={name} 
      lastRank={lastRank}
      videoLink={videoLink}
      gardenLink={gardenIdx}
      stepUpToday={(gardenHugStepLastDate === moment().format('YYYY-MM-DD') ? true : false) }
      children={children}
    />
  </TraineeContainer>

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
  lastRank, 
  videoLink,
  gardenLink,
  stepUpToday, 
  children
}) =>
  <TraineeDescriptionContainer>
    <TraineeLabel 
      name={name} 
      lastRank={lastRank}
      videoLink={videoLink}
      gardenLink={gardenLink}
      stepUpToday={stepUpToday}
    />
    {children}
  </TraineeDescriptionContainer>

const TraineeLabel = ({ 
  name,
  lastRank,
  videoLink,
  gardenLink, 
  stepUpToday 
}) =>
  <TraineeLabelContainer>
    <TraineeRank>{lastRank}</TraineeRank>
    <TraineeName>{name}</TraineeName>
    {
      (videoLink)
       ? <a href={videoLink} target="_blank"><Icon name='video play'/></a>
       : null
    }
    {
      (gardenLink) 
        ? <a href={'https://produce48.kr/m48_detail.php?idx=' + gardenLink + '&cate=hug'} target="_blank">
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