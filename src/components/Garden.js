import React, { Component } from 'react';
import axios from 'axios';
import { Icon, Menu, Progress, Message, Loader, Segment, Image, Dimmer } from 'semantic-ui-react';
import { Progress as ReactStrapProgress } from 'reactstrap';
import { sortBy } from 'lodash';
import FlipMove from 'react-flip-move';
import './Garden.css';

const MAIN_PICTURE_PATH = '/images/mainPictures/';
const PATH_FETCH = 'https://a8qz9fc7k3.execute-api.ap-northeast-2.amazonaws.com/default/scanProduce48';

const SORTS = {
  RATE: list => sortBy(list, 'gardenHugRate').reverse(),
}

class Garden extends Component {
  constructor(props) {
    super(props);

    this.state = {
      traineeData: [],
      sortKey: 'RATE',
      error: null,
      isLoading: false,
    };

    this.fetchTraineeData = this.fetchTraineeData.bind(this);
    this.setTraineeData = this.setTraineeData.bind(this);
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
    });
  }

  render() {
    const {
      traineeData,
      sortKey,
      isLoading
    } = this.state;

    return (
      <div>
        <Message
          className='top-message'
          attached
          header='국프의 정원 후원 현황'
          content='5분마다 최신 정보로 업데이트합니다.'
        />
        { isLoading
          ? <Segment>
              <Dimmer active inverted>
                <Loader size='large'>Loading</Loader>
              </Dimmer>
        
              <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
            </Segment>
          : <FlipMove>
            {SORTS[sortKey](traineeData).map(trainee => {
              return (
                <div key={trainee.id} className='trainee-info'>
                  <div className='trainee-picture'>
                    <span className='trainee-picture-mask'></span>
                    <img 
                      className='trainee-picture'
                      alt={trainee.name}
                      src={MAIN_PICTURE_PATH + trainee.id + '.jpg'}
                    />
                  </div>
                  <div className='trainee-description'>
                    <div className='trainee-name-group'>
                      <span className='trainee-last-rank'>{trainee.lastRank}</span>
                      <span className='trainee-name-kr'>{trainee.name}</span>
                      <span className='trainee-name-en'>{trainee.nameInEnglish}</span>
                      <a href={'https://produce48.kr/m48_detail.php?idx=' + trainee.gardenIdx + '&cate=hug'} target="_blank"><Icon name='linkify'/></a>
                    </div>
                    <div className='trainee-step-group'>
                    <ReactStrapProgress multi>
                      {(trainee.gardenHugRate >= 20)
                        ? <ReactStrapProgress bar value="20" className='video play icon'>
                            {(traineeData.gardenHugFirstVideo)
                              ? <a href="{traineeData.gardenHugFirstVideo}"><span>영상보기</span></a>
                              : <span>1단계</span>
                            }
                          </ReactStrapProgress>
                        : <ReactStrapProgress bar value={trainee.gardenHugRate}></ReactStrapProgress>
                      }
                      {(trainee.gardenHugRate >= 40)
                        ? <ReactStrapProgress bar value="20">
                            {(traineeData.gardenHugSecondVideo)
                              ? <a href="{traineeData.gardenHugSecondVideo}"><span>영상보기</span></a>
                              : <span>2단계</span>
                            }
                          </ReactStrapProgress>
                        : <ReactStrapProgress bar value={trainee.gardenHugRate - 20.0}></ReactStrapProgress>
                      }
                      {(trainee.gardenHugRate >= 60)
                        ? <ReactStrapProgress bar value="20">
                            {(traineeData.gardenHugThirdVideo)
                              ? <a href="{traineeData.gardenHugThirdVideo}"><span>영상보기</span></a>
                              : <span>3단계</span>
                            }
                          </ReactStrapProgress>
                        : <ReactStrapProgress bar value={trainee.gardenHugRate - 40.0}></ReactStrapProgress>
                      }
                      {(trainee.gardenHugRate >= 80)
                        ? <ReactStrapProgress bar value="20">
                            {(traineeData.gardenHugForthVideo)
                              ? <a href="{traineeData.gardenHugForthVideo}"><span>영상보기</span></a>
                              : <span>4단계</span>
                            }
                          </ReactStrapProgress>
                        : <ReactStrapProgress bar value={trainee.gardenHugRate - 60.0}></ReactStrapProgress>
                      }
                      {(trainee.gardenHugRate >= 100)
                        ? <ReactStrapProgress bar value="20">
                            {(traineeData.gardenHugFifthVideo)
                              ? <a href="{traineeData.gardenHugFifthVideo}"><span>영상보기</span></a>
                              : <span>5단계</span>
                            }
                          </ReactStrapProgress>
                        : <ReactStrapProgress bar value={trainee.gardenHugRate - 80.0}></ReactStrapProgress>
                      }
                    </ReactStrapProgress>
                    </div>
                  </div>
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

const Trainee = ({
  trainee
}) => {
  return (
    <div>{trainee.name} : {trainee.gardenHugRate}</div>
  )
}

export default Garden;