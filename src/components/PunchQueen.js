import React, { Component } from 'react';
import axios from 'axios';
import { Message, Menu } from 'semantic-ui-react';
import { sortBy, maxBy } from 'lodash';
import FlipMove from 'react-flip-move';
import LoadingContent from './LoadingContent';
import Trainee from './Trainee';
import ProgressBar from './ProgressBar';

const PATH_FETCH = 'data/produce48.json';

const SORTS = {
  PUNCH: list => sortBy(list, 'punchPoint').reverse(),
}

const filter = item => {
  return typeof item.punchPoint === 'number';
}

class PunchQueen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      traineeData: [],
      maxPoint: 0,
      error: null,
      isLoading: false,
    }

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
      maxPoint: maxBy(data, 'punchPoint').punchPoint,
    });
  }

  render() {
    const {
      i18n,
      t,
    } = this.props;

    const {
      traineeData,
      maxPoint,
      isLoading
    } = this.state;

    return (
      <div>
        <Message
          style={{ textAlign: 'center' }}
          attached
          header={t('top-menu-punchqueen')}
          content={t('be-updated-every-midnight-hopeful')}
        />
        <Menu icon='labeled' attached fluid widths={1}>
          <Menu.Item
            as='a'
            href='https://tv.naver.com/v/3922158'
            target='_blank'
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="134" height="22">
              <defs>
                <linearGradient id="a" x1="50%" x2="50%" y1="87.237%" y2="-1.735%">
                  <stop offset="0%" stopColor="#00DE7B"></stop>
                  <stop offset="100%" stopColor="#00BA6E"></stop>
                </linearGradient>
              </defs>
              <g fill="none" fillRule="evenodd">
                <g fillRule="nonzero" transform="translate(-2 -2)">
                  <path fill="url(#a)" d="M2 4.96h5.78V21.1H2z"></path>
                  <rect width="5.78" height="21.08" x="8.498" y="6.51" fill="#00DE7B" rx="2.89" transform="rotate(58 11.388 17.05)"></rect>
                  <rect width="5.79" height="21.116" x="8.495" y="-1.633" fill="#00DE7B" rx="2.89" transform="rotate(-58.055 11.39 8.925)"></rect>
                </g>
                <path d="M36.882 4.928v6.998L30.54 4.128c-.467-.563-1.044-1.084-2.088-1.084h-.37C26.914 3.044 26 3.9 26 4.994v12.078c0 1.063.924 1.928 2.059 1.928 1.135 0 2.059-.865 2.059-1.928V9.77l6.595 8.103c.468.563 1.045 1.084 2.09 1.084h.115c1.167 0 2.082-.857 2.082-1.95V4.928C41 3.865 40.076 3 38.94 3c-1.135 0-2.058.865-2.058 1.928zm15.205 7.076H48.85l1.619-3.979 1.618 3.979zm.631-7.525C52.305 3.525 51.558 3 50.615 3h-.188c-.957 0-1.711.525-2.125 1.48l-5.09 11.866c-.105.239-.212.523-.212.825 0 1.026.77 1.829 1.751 1.829.767 0 1.413-.449 1.73-1.203l.953-2.308h6.07l.912 2.203c.363.856.982 1.308 1.79 1.308C57.213 19 58 18.178 58 17.128c0-.238-.06-.487-.19-.78l-5.092-11.87zM85.114 15.41h-6.998v-2.67h5.848c1.04 0 1.885-.8 1.885-1.785 0-.995-.845-1.805-1.885-1.805h-5.848V6.59H85c1.04 0 1.886-.8 1.886-1.784C86.886 3.81 86.04 3 85 3h-8.93C74.91 3 74 3.87 74 4.982v12.036c0 1.111.91 1.982 2.07 1.982h9.044c1.04 0 1.886-.8 1.886-1.784 0-.996-.846-1.806-1.886-1.806m13.01-6.902v.044c0 1.178-.838 1.881-2.24 1.881h-3.05V6.604h2.986c1.05 0 2.304.33 2.304 1.904M102 8.377v-.044c0-1.507-.47-2.786-1.36-3.698C99.599 3.565 98.027 3 96.098 3h-5.18C89.842 3 89 3.864 89 4.966v12.068c0 1.102.842 1.966 1.917 1.966 1.075 0 1.917-.864 1.917-1.966v-3.062h2.213l3.114 4.046c.505.66 1.106.982 1.837.982.9 0 1.832-.686 1.832-1.835 0-.642-.28-1.059-.596-1.47l-2.051-2.555c1.845-.91 2.817-2.55 2.817-4.763M68.183 4.339L64.5 13.446l-3.683-9.105C60.468 3.451 59.846 3 58.967 3 57.864 3 57 3.841 57 4.915c0 .342.11.649.219.905l4.965 11.696C62.593 18.473 63.415 19 64.5 19c1.085 0 1.907-.527 2.317-1.485L71.78 5.82c.108-.256.219-.563.219-.905C72 3.841 71.136 3 70.033 3c-.878 0-1.501.451-1.85 1.339zm39.614 2.408h3.977v10.21c0 1.07.862 1.937 1.926 1.937a1.932 1.932 0 0 0 1.926-1.937V6.747h4.286l4.476 10.769c.4.957 1.206 1.484 2.269 1.484 1.062 0 1.867-.527 2.268-1.485l4.861-11.696c.106-.255.214-.562.214-.904A1.9 1.9 0 0 0 132.074 3c-.86 0-1.47.451-1.81 1.339l-3.606 9.104-3.63-9.161a1.815 1.815 0 0 0-1.686-1.15h-13.545c-.992 0-1.797.809-1.797 1.807 0 .998.805 1.808 1.797 1.808" fill="#3C3C3C"></path>
              </g>
            </svg>
            <p style={{ marginTop: '5px' }}>[48스페셜] 펀치퀸 내 거야♥</p>
          </Menu.Item>
        </Menu>
        { isLoading
          ? <LoadingContent />
          : <FlipMove>
            {SORTS['PUNCH'](traineeData.filter(filter)).map(trainee => {
              let value, max;
              value = trainee.punchPoint;
              max = maxPoint;
              return (
                <div key={trainee.id}>
                  <Trainee
                    i18n={i18n}
                    t={t}
                    trainee={trainee}
                    disableRankChart={true}
                    usePunchName={true}
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

export default PunchQueen;