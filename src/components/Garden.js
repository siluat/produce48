import React, { Component } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Icon, Message, Loader, Segment, Image, Dimmer, Menu, Label } from 'semantic-ui-react';
import { Progress as ReactStrapProgress } from 'reactstrap';
import { chain, find } from 'lodash';
import moment from 'moment';
import FlipMove from 'react-flip-move';
import './Garden.css';

const MAIN_PICTURE_PATH = '/images/mainPictures/';
const PATH_FETCH = 'https://a8qz9fc7k3.execute-api.ap-northeast-2.amazonaws.com/default/scanProduce48';

const SORTS = {
  RATE: (list, selected) => {
    let filtered = null;

    if (selected && Array.isArray(selected) && selected.length > 0) {
      filtered = list.filter(item => {
        return find(selected, { value: item.id });
      });
    } else {
      filtered = list;
    }

    return chain(filtered).sortBy('lastRank')
                          .sortBy('gardenHugStepLastDate').reverse()
                          .sortBy('gardenHugRate').reverse().value()
  }
}

class Garden extends Component {
  constructor(props) {
    super(props);

    this.state = {
      traineeData: [],
      traineeSelection: [],
      traineeSelected: null,
      selectedMenu: 'step',
      sortKey: 'RATE',
      error: null,
      isLoading: false,
    };

    this.fetchTraineeData = this.fetchTraineeData.bind(this);
    this.setTraineeData = this.setTraineeData.bind(this);
    this.setPropertyForSelection = this.setPropertyForSelection.bind(this);
    this.onClickStep = this.onClickStep.bind(this);
    this.onClickVideo = this.onClickVideo.bind(this);
    this.onClickTimeStamp = this.onClickTimeStamp.bind(this);
    this.onClickDays = this.onClickDays.bind(this);
    this.onChangeSelection = this.onChangeSelection.bind(this);
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
    this.setPropertyForSelection(data);

    this.setState({
      traineeData: data,
      isLoading: false,
    });
  }

  setPropertyForSelection(data) {
    const selection = []

    data.forEach(item => {
      selection.push({
        value: item.id,
        label: item.name
      });
    });
    this.setState({
      traineeSelection: selection,
    });
  }

  onClickStep() {
    this.setState({ selectedMenu: 'step' });
  }

  onClickVideo() {
    this.setState({ selectedMenu: 'video' });
  }

  onClickTimeStamp() {
    this.setState({ selectedMenu: 'timestamp' });
  }

  onClickDays() {
    this.setState({ selectedMenu: 'days' });
  }

  onChangeSelection(selectedOption) {
    this.setState({ traineeSelected: selectedOption });
  }

  render() {
    const {
      traineeData,
      traineeSelection,
      traineeSelected,
      selectedMenu,
      sortKey,
      isLoading,
    } = this.state;

    return (
      <div className='page-content'>
        <Message
          className='top-message'
          attached
          header='국프의 정원 후원 현황'
          content='5분마다 최신 정보로 업데이트합니다.'
        />
        <MenuBar
          activeItem={selectedMenu}
          onClickStep={this.onClickStep}
          onClickVideo={this.onClickVideo}
          onClickTimeStamp={this.onClickTimeStamp}
          onClickDays={this.onClickDays}
        />
        
        { isLoading
          ? <Segment>
              <Dimmer active inverted>
                <Loader size='large'>Loading</Loader>
              </Dimmer>
              <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
            </Segment>
          : <div>
              <Select
                className='trainee-selector'
                isMulti
                placeholder='이름'
                closeMenuOnSelect={false}
                value={traineeSelected}
                options={traineeSelection} 
                onChange={this.onChangeSelection} 
              /> 
              <FlipMove>
              {SORTS[sortKey](traineeData, traineeSelected).map(trainee => {
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
                        <a href={'https://produce48.kr/m48_detail.php?idx=' + trainee.gardenIdx + '&cate=hug'} target="_blank"><Icon name='external'/></a>
                        {
                          (trainee.gardenHugStepLastDate === moment().format('YYYY-MM-DD'))
                          ? <Label basic pointing='left' size='mini'>
                              오늘 한 칸 상승!
                            </Label>
                          : ''
                        }
                      </div>
                      <div className='trainee-step-group'>
                      <ReactStrapProgress className={(trainee.retired) ? 'retired' : ''} multi>
                        {(trainee.gardenHugRate >= 20)
                          ? <ReactStrapProgress bar value="20">
                              {
                                (selectedMenu === 'step')
                                ? <span>1단계</span> : ''
                              }
                              {(selectedMenu === 'video')
                                ? (trainee.gardenHugFirstVideo) 
                                  ? <a href={trainee.gardenHugFirstVideo} className="link-video" target="_blank"><Icon name='play circle' /></a>
                                  : <span>-</span>
                                : ''
                              }
                              {(selectedMenu === 'timestamp')
                                ? <span>{moment(trainee.gardenHugStep13Date).format('M/D')}</span> : ''
                              }
                              {(selectedMenu === 'days')
                                ? <span>{moment(trainee.gardenHugStep13Date).diff('2018-05-21', 'days')}일</span> : ''
                              }
                            </ReactStrapProgress>
                          : <ReactStrapProgress bar value={trainee.gardenHugRate}></ReactStrapProgress>
                        }
                        {(trainee.gardenHugRate >= 40)
                          ? <ReactStrapProgress bar value="20">
                              {
                                (selectedMenu === 'step')
                                ? <span>2단계</span> : ''
                              }
                              {(selectedMenu === 'video')
                                ? (trainee.gardenHugSecondVideo) 
                                  ? <a href={trainee.gardenHugSecondVideo} className="link-video" target="_blank"><Icon name='play circle' /></a>
                                  : <span>-</span>
                                : ''
                              }
                              {(selectedMenu === 'timestamp')
                                ? <span>{moment(trainee.gardenHugStep23Date).format('M/D')}</span> : ''
                              }
                              {(selectedMenu === 'days')
                                ? <span>{moment(trainee.gardenHugStep23Date).diff(trainee.gardenHugStep13Date, 'days')}일</span> : ''
                              }
                            </ReactStrapProgress>
                          : <ReactStrapProgress bar value={trainee.gardenHugRate - 20.0}></ReactStrapProgress>
                        }
                        {(trainee.gardenHugRate >= 60)
                          ? <ReactStrapProgress bar value="20">
                              {
                                (selectedMenu === 'step')
                                ? <span>3단계</span> : ''
                              }
                              {(selectedMenu === 'video')
                                ? (trainee.gardenHugThirdVideo) 
                                  ? <a href={trainee.gardenHugThirdVideo} className="link-video" target="_blank"><Icon name='play circle' /></a>
                                  : <span>-</span>
                                : ''
                              }
                              {(selectedMenu === 'timestamp')
                                ? <span>{moment(trainee.gardenHugStep33Date).format('M/D')}</span> : ''
                              }
                              {(selectedMenu === 'days')
                                ? <span>{moment(trainee.gardenHugStep33Date).diff(trainee.gardenHugStep23Date, 'days')}일</span> : ''
                              }
                            </ReactStrapProgress>
                          : <ReactStrapProgress bar value={trainee.gardenHugRate - 40.0}></ReactStrapProgress>
                        }
                        {(trainee.gardenHugRate >= 80)
                          ? <ReactStrapProgress bar value="20">
                              {
                                (selectedMenu === 'step')
                                ? <span>4단계</span> : ''
                              }
                              {(selectedMenu === 'video')
                                ? (trainee.gardenHugFourthVideo) 
                                  ? <a href={trainee.gardenHugFourthVideo} className="link-video" target="_blank"><Icon name='play circle' /></a>
                                  : <span>-</span>
                                : ''
                              }
                              {(selectedMenu === 'timestamp')
                                ? <span>{moment(trainee.gardenHugStep43Date).format('M/D')}</span> : ''
                              }
                              {(selectedMenu === 'days')
                                ? <span>{moment(trainee.gardenHugStep43Date).diff(trainee.gardenHugStep33Date, 'days')}일</span> : ''
                              }
                            </ReactStrapProgress>
                          : <ReactStrapProgress bar value={trainee.gardenHugRate - 60.0}></ReactStrapProgress>
                        }
                        {(trainee.gardenHugRate >= 100)
                          ? <ReactStrapProgress bar value="20">
                              {
                                (selectedMenu === 'step')
                                ? <span>5단계</span> : ''
                              }
                              {(selectedMenu === 'video')
                                ? (trainee.gardenHugFifthVideo) 
                                  ? <a href={trainee.gardenHugFifthVideo} className="link-video" target="_blank"><Icon name='play circle' /></a>
                                  : <span>-</span>
                                : ''
                              }
                              {(selectedMenu === 'timestamp')
                                ? <span>{moment(trainee.gardenHugStep53Date).format('M/D')}</span> : ''
                              }
                              {(selectedMenu === 'days')
                                ? <span>{moment(trainee.gardenHugStep53Date).diff(trainee.gardenHugStep43Date, 'days')}일</span> : ''
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
          </div>
        }
      </div>
    )
  }
}

const MenuBar = ({
  activeItem,
  onClickStep,
  onClickVideo,
  onClickTimeStamp,
  onClickDays
}) =>
<Menu icon='labeled' attached fluid widths={4}>
<Menu.Item
  name='step'
  active={activeItem === 'step'}
  onClick={onClickStep}>
  <Icon name='chart line' />
  단계현황
</Menu.Item>
<Menu.Item
  name='video'
  active={activeItem === 'video'}
  onClick={onClickVideo}>
  <Icon name='play circle outline' />
  인증영상
</Menu.Item>
<Menu.Item
  name='timestamp'
  active={activeItem === 'timestamp'}
  onClick={onClickTimeStamp}
>
  <Icon name='calendar check' />
  달성일
</Menu.Item>
<Menu.Item
  name='days'
  active={activeItem === 'days'}
  onClick={onClickDays}
>
  <Icon name='hourglass end' />
  달성기간
</Menu.Item>
</Menu>

export default Garden;