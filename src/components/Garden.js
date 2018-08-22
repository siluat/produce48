import React, { Component } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Icon, Message, Menu, Sticky } from 'semantic-ui-react';
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
    const selection = [];

    data.forEach(item => {
      let name;

      switch (this.props.i18n.language) {
        case 'jp':
          name = item.nameInJapanese;
          break;
        case 'en':
          name = item.nameInEnglish;
          break;
        default:
          name = item.name;
      }

      selection.push({
        value: item.id,
        label: name
      });
    });

    this.setState({
      traineeSelected: null,
      traineeSelection: selection
    });
  }

  componentWillReceiveProps() {
    this.setPropertyForSelection(this.state.traineeData);
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

  handleContextRef = contextRef => this.setState({ contextRef });

  render() {
    const {
      i18n,
      t
    } = this.props;

    const {
      traineeData,
      traineeSelection,
      traineeSelected,
      selectedMenu,
      sortKey,
      isLoading,
      contextRef
    } = this.state;

    return (
      <div ref={this.handleContextRef}>
        <Message
          style={{ textAlign: 'center' }}
          attached
          header={t('garden-title')}
          content={t('be-updated-every-midnight')}
        />
        <Sticky context={contextRef} offset={40}>
          <MenuBar
            t={t}
            activeItem={selectedMenu}
            onClickStep={this.onClickStep}
            onClickVideo={this.onClickVideo}
            onClickTimeStamp={this.onClickTimeStamp}
            onClickDays={this.onClickDays}
          />
        </Sticky>
        { isLoading
          ? <LoadingContent />
          : <div>
              <Select
                style={{ zIndex: 900 }}
                isMulti
                placeholder={t('placeholder-name')}
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
                      i18n={i18n}
                      t={t}
                      trainee={trainee}
                      gardenIdx={trainee.gardenIdx}
                      gardenHugStepLastDate={trainee.gardenHugStepLastDate}
                    >
                      <GardenData
                        t={t}
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
  t,
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
      onClick={onClickStep}
      color='pink'
    >
      <Icon name='chart line' />
      {t('garden-step-view')}
    </Menu.Item>
    <Menu.Item
      name='video'
      active={activeItem === 'video'}
      onClick={onClickVideo}
      color='pink'
    >
      <Icon name='play circle outline' />
      {t('garden-video-view')}
    </Menu.Item>
    <Menu.Item
      name='timestamp'
      active={activeItem === 'timestamp'}
      onClick={onClickTimeStamp}
      color='pink'
    >
      <Icon name='calendar check' />
      {t('garden-timestamp-view')}
    </Menu.Item>
    <Menu.Item
      name='days'
      active={activeItem === 'days'}
      onClick={onClickDays}
      color='pink'
    >
      <Icon name='hourglass end' />
      {t('garden-days-view')}
    </Menu.Item>
  </Menu>

export default Garden;