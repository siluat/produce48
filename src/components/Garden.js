import React, { Component } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Icon, Message, Menu } from 'semantic-ui-react';
import { chain, find } from 'lodash';
import FlipMove from 'react-flip-move';
import LoadingContent from './LoadingContent';
import Trainne from './Trainee';
import GardenData from './GardenData';

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
      <div>
        <Message
          style={{ textAlign: 'center' }}
          attached
          header='국프의 정원 후원 현황'
          content='매일 자정에 업데이트됩니다.'
        />
        <MenuBar
          activeItem={selectedMenu}
          onClickStep={this.onClickStep}
          onClickVideo={this.onClickVideo}
          onClickTimeStamp={this.onClickTimeStamp}
          onClickDays={this.onClickDays}
        />
        
        { isLoading
          ? <LoadingContent />
          : <div>
              <Select
                style={{ 'z-index': 999 }}
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
                  <div key={trainee.id}>
                    <Trainne 
                      id={trainee.id}
                      name={trainee.name}
                      week1Rank={trainee.week1Rank}
                      week2Rank={trainee.week2Rank}
                      week3Rank={trainee.week3Rank}
                      week4Rank={trainee.week4Rank}
                      week7Rank={trainee.week7Rank}
                      lastRank={trainee.lastRank}
                      gardenIdx={trainee.gardenIdx}
                      gardenHugStepLastDate={trainee.gardenHugStepLastDate}
                    >
                      <GardenData
                        selectedMenu={selectedMenu}
                        retired={trainee.retired}
                        gardenHugRate={trainee.gardenHugRate}
                        gardenHugFirstVideo={trainee.gardenHugFirstVideo}
                        gardenHugSecondVideo={trainee.gardenHugSecondVideo}
                        gardenHugThirdVideo={trainee.gardenHugThirdVideo}
                        gardenHugFourthVideo={trainee.gardenHugFourthVideo}
                        gardenHugFifthVideo={trainee.gardenHugFifthVideo}
                        gardenHugStep13Date={trainee.gardenHugStep13Date}
                        gardenHugStep23Date={trainee.gardenHugStep23Date}
                        gardenHugStep33Date={trainee.gardenHugStep33Date}
                        gardenHugStep43Date={trainee.gardenHugStep43Date}
                        gardenHugStep53Date={trainee.gardenHugStep53Date}
                      />
                    </Trainne>
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