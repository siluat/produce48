import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import moment from 'moment';

const VideoLink = styled.a`
  color: #fff;
  font-size: 1.1rem;
  &:hover {
    color: #fff;
  }
`

const GardenStepProgressContainer = styled.div`
display: flex;
overflow: hidden;
background-color: #e9ecef;
border-radius: .5rem;
box-sizing: border-box;
height: 30px;
`

const GardenStepBar = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
color: #fff;
text-align: center;
white-space: nowrap;
height: 30px;
background-color: ${props => props.retired ? '#999' : '#ff50a0'};
transition: width .6s ease;
box-sizing: border-box;
font-size: .89rem;
font-weight: bold;
&:not(:last-child) {
  border-right: .1px solid #fff;
}
`

const GardenData = ({
  selectedMenu,
  retired,
  gardenHugRate,
  gardenHugFirstVideo,
  gardenHugSecondVideo,
  gardenHugThirdVideo,
  gardenHugFourthVideo,
  gardenHugFifthVideo,
  gardenHugStep13Date,
  gardenHugStep23Date,
  gardenHugStep33Date,
  gardenHugStep43Date,
  gardenHugStep53Date
}) =>
  <GardenStepProgress>
    {
      (gardenHugRate >= 20)
        ? <GardenStepBar style= {{ width: '20%' }} retired={retired}>
            {(() => {
              switch (selectedMenu) {
                case 'video':
                  return (
                    (gardenHugFirstVideo)
                    ? <VideoLink href={gardenHugFirstVideo} target="_blank"><Icon name='play circle' /></VideoLink>
                    : <span>-</span>
                  );
                case 'timestamp':
                  return <span>{moment(gardenHugStep13Date).format('M/D')}</span>;
                case 'days':
                  return <span>{moment(gardenHugStep13Date).diff('2018-05-21', 'days')}일</span>
                default:
                  return <span>1단계</span>;
              }
            })()}
          </GardenStepBar>
        : <GardenStepBar 
            style={{ width: gardenHugRate + '%' }}
            retired={retired}
          >
          </GardenStepBar>
    }
    {
      (gardenHugRate >= 40)
        ? <GardenStepBar style= {{ width: '20%' }} retired={retired}>
            {(() => {
              switch (selectedMenu) {
                case 'video':
                  return (
                    (gardenHugSecondVideo)
                    ? <VideoLink href={gardenHugSecondVideo} target="_blank"><Icon name='play circle' /></VideoLink>
                    : <span>-</span>
                  );
                case 'timestamp':
                  return <span>{moment(gardenHugStep23Date).format('M/D')}</span>;
                case 'days':
                  return <span>{moment(gardenHugStep23Date).diff(gardenHugStep13Date, 'days')}일</span>
                default:
                  return <span>2단계</span>;
              }
            })()}
          </GardenStepBar>
        : <GardenStepBar 
            style= {{ width: (gardenHugRate - 20) + '%' }}
            retired={retired}
          >
          </GardenStepBar>
    }
    {
      (gardenHugRate >= 60)
        ? <GardenStepBar style= {{ width: '20%' }} retired={retired}>
            {(() => {
              switch (selectedMenu) {
                case 'video':
                  return (
                    (gardenHugThirdVideo)
                    ? <VideoLink href={gardenHugThirdVideo} target="_blank"><Icon name='play circle' /></VideoLink>
                    : <span>-</span>
                  );
                case 'timestamp':
                  return <span>{moment(gardenHugStep33Date).format('M/D')}</span>;
                case 'days':
                  return <span>{moment(gardenHugStep33Date).diff(gardenHugStep23Date, 'days')}일</span>
                default:
                  return <span>3단계</span>;
              }
            })()}
          </GardenStepBar>
        : <GardenStepBar 
            style= {{ width: (gardenHugRate - 40) + '%' }}
            retired={retired}
          >
          </GardenStepBar>
    }
    {
      (gardenHugRate >= 80)
        ? <GardenStepBar style= {{ width: '20%' }} retired={retired}>
            {(() => {
              switch (selectedMenu) {
                case 'video':
                  return (
                    (gardenHugFourthVideo)
                    ? <VideoLink href={gardenHugFourthVideo} target="_blank"><Icon name='play circle' /></VideoLink>
                    : <span>-</span>
                  );
                case 'timestamp':
                  return <span>{moment(gardenHugStep43Date).format('M/D')}</span>;
                case 'days':
                  return <span>{moment(gardenHugStep43Date).diff(gardenHugStep33Date, 'days')}일</span>
                default:
                  return <span>4단계</span>;
              }
            })()}
          </GardenStepBar>
        : <GardenStepBar 
            style= {{ width: (gardenHugRate - 60) + '%' }}
            retired={retired}
          >
          </GardenStepBar>
    }
    {
      (gardenHugRate >= 100)
        ? <GardenStepBar style= {{ width: '20%' }} retired={retired}>
            {(() => {
              switch (selectedMenu) {
                case 'video':
                  return (
                    (gardenHugFifthVideo)
                    ? <VideoLink href={gardenHugFifthVideo} target="_blank"><Icon name='play circle' /></VideoLink>
                    : <span>-</span>
                  );
                case 'timestamp':
                  return <span>{moment(gardenHugStep53Date).format('M/D')}</span>;
                case 'days':
                  return <span>{moment(gardenHugStep53Date).diff(gardenHugStep43Date, 'days')}일</span>
                default:
                  return <span>5단계</span>;
              }
            })()}
          </GardenStepBar>
        : <GardenStepBar 
            style= {{ width: (gardenHugRate - 80) + '%' }}
            retired={retired}
          >
          </GardenStepBar>
    }
  </GardenStepProgress>

const GardenStepProgress = ({
children
}) =>
<GardenStepProgressContainer>
  {children}
</GardenStepProgressContainer>

export default GardenData;