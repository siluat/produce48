import React, { Component } from 'react';
import axios from 'axios';
import { Segment } from 'semantic-ui-react';
import { sortBy, maxBy } from 'lodash';
import FlipMove from 'react-flip-move';
import LoadingContent from './LoadingContent';
import Trainee from './Trainee';
import ProgressBar from './ProgressBar';

const PATH_FETCH = 'https://a8qz9fc7k3.execute-api.ap-northeast-2.amazonaws.com/default/scanProduce48';

const SORTS = {
  VOTE: list => sortBy(list, 'finalVote').reverse(),
}

const filter = item => {
  return !item.retired;
}

class Izone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      traineeData: [],
      maxVote: 0,
      error: null,
      isLoading: false,
    }

    this.fetchTraineeData = this.fetchTraineeData.bind(this);
    this.setTraineeData = this.setTraineeData.bind(this);
  }

  componentDidMount() {
    this.fetchTraineeData();
  }

  componentDidUpdate() {
    const progresses = document.querySelectorAll('.bar .progress, .outer-value');

    for (let i = 0; i < progresses.length; i++) {
      let t = progresses[i].textContent;
      progresses[i].textContent = t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
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
      maxVote: maxBy(data, 'finalVote').finalVote,
    });
  }

  render() {
    const {
      i18n,
      t,
    } = this.props;

    const {
      traineeData,
      maxVote,
      isLoading
    } = this.state;

    return (
      <div>
        <Segment 
          attached textAlign='center'
          style={{ backgroundColor: '#ff50a0', padding: '0' }}
        >
          <img src='images/izone.png' style={{ width: '300px' }} alt='IZONE' />
        </Segment>
        { isLoading
          ? <LoadingContent />
          : <FlipMove>
            {SORTS['VOTE'](traineeData.filter(filter)).map(trainee => {
              let value, max;
              value = trainee.finalVote;
              max = maxVote;
              return (
                <div key={trainee.id}>
                  <Trainee
                    i18n={i18n}
                    t={t}
                    trainee={trainee}
                  >
                    <ProgressBar value={value} max={max} />
                  </Trainee>
                </div>
              )})
            }
          </FlipMove>
        }
      </div>
    )
  }
}

export default Izone;