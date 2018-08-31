import React, { Component } from 'react';
import axios from 'axios';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter,
  XAxis,
  YAxis,
  ReferenceLine,
  LabelList
} from 'recharts';
import moment from 'moment';
import LoadingContent from './LoadingContent';

const PATH_FETCH = 'https://a8qz9fc7k3.execute-api.ap-northeast-2.amazonaws.com/default/scanProduce48';

class D2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      traineeData: [],
      chartData: [1],
      error: null,
      isLoading: false
    };

    this.fetchTraineeData = this.fetchTraineeData.bind(this);
    this.setTraineeData = this.setTraineeData.bind(this);
    this.genChartData = this.genChartData.bind(this);
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
    this.genChartData(data);

    this.setState({
      traineeData: data,
      isLoading: false,
    });
  }

  genChartData(data) {
    const chartData = data.filter(item => { return !item.retired }).map(item => {

      let dataset = {
        id: item.id,
        name: item.name,
        timestamp: []
      };

      dataset.timestamp.push({
        value: 0,
        time: moment('2018-05-21').unix()
      });

      if (!item.gardenHugStep11Date) {
        dataset.timestamp[dataset.timestamp.length - 1].name = item.name;
        return dataset;
      }
      dataset.timestamp.push({
        value: 6.6,
        time: moment(item.gardenHugStep11Date).unix()
      });

      if (!item.gardenHugStep12Date) {
        dataset.timestamp[dataset.timestamp.length - 1].name = item.name;
        return dataset;
      }
      dataset.timestamp.push({
        value: 13.2,
        time: moment(item.gardenHugStep12Date).unix()
      });

      if (!item.gardenHugStep13Date) {
        dataset.timestamp[dataset.timestamp.length - 1].name = item.name;
        return dataset;
      }
      dataset.timestamp.push({
        value: 20,
        time: moment(item.gardenHugStep13Date).unix()
      });

      if (!item.gardenHugStep21Date) {
        dataset.timestamp[dataset.timestamp.length - 1].name = item.name;
        return dataset;
      }
      dataset.timestamp.push({
        value: 26.6,
        time: moment(item.gardenHugStep21Date).unix()
      });

      if (!item.gardenHugStep22Date) {
        dataset.timestamp[dataset.timestamp.length - 1].name = item.name;
        return dataset;
      }
      dataset.timestamp.push({
        value: 33.2,
        time: moment(item.gardenHugStep22Date).unix()
      });

      if (!item.gardenHugStep23Date) {
        dataset.timestamp[dataset.timestamp.length - 1].name = item.name;
        return dataset;
      }
      dataset.timestamp.push({
        value: 40,
        time: moment(item.gardenHugStep23Date).unix()
      });

      if (!item.gardenHugStep31Date) {
        dataset.timestamp[dataset.timestamp.length - 1].name = item.name;
        return dataset;
      }
      dataset.timestamp.push({
        value: 46.6,
        time: moment(item.gardenHugStep31Date).unix()
      });

      if (!item.gardenHugStep32Date) {
        dataset.timestamp[dataset.timestamp.length - 1].name = item.name;
        return dataset;
      }
      dataset.timestamp.push({
        value: 53.2,
        time: moment(item.gardenHugStep32Date).unix()
      });

      if (!item.gardenHugStep33Date) {
        dataset.timestamp[dataset.timestamp.length - 1].name = item.name;
        return dataset;
      }
      dataset.timestamp.push({
        value: 60,
        time: moment(item.gardenHugStep33Date).unix()
      });

      if (!item.gardenHugStep41Date) {
        dataset.timestamp[dataset.timestamp.length - 1].name = item.name;
        return dataset;
      }
      dataset.timestamp.push({
        value: 66.6,
        time: moment(item.gardenHugStep41Date).unix()
      });

      if (!item.gardenHugStep42Date) {
        dataset.timestamp[dataset.timestamp.length - 1].name = item.name;
        return dataset;
      }
      dataset.timestamp.push({
        value: 73.2,
        time: moment(item.gardenHugStep42Date).unix()
      });

      if (!item.gardenHugStep43Date) {
        dataset.timestamp[dataset.timestamp.length - 1].name = item.name;
        return dataset;
      }
      dataset.timestamp.push({
        value: 80,
        time: moment(item.gardenHugStep43Date).unix()
      });

      if (!item.gardenHugStep51Date) {
        dataset.timestamp[dataset.timestamp.length - 1].name = item.name;
        return dataset;
      }
      dataset.timestamp.push({
        value: 86.6,
        time: moment(item.gardenHugStep51Date).unix()
      });

      if (!item.gardenHugStep52Date) {
        dataset.timestamp[dataset.timestamp.length - 1].name = item.name;
        return dataset;
      }
      dataset.timestamp.push({
        value: 93.2,
        time: moment(item.gardenHugStep52Date).unix()
      });

      if (!item.gardenHugStep53Date) {
        dataset.timestamp[dataset.timestamp.length - 1].name = item.name;
        return dataset;
      }
      dataset.timestamp.push({
        value: 100,
        time: moment(item.gardenHugStep53Date).unix()
      });

      dataset.timestamp[dataset.timestamp.length - 1].name = item.name;
      return dataset;
    });

    console.log(chartData);

    this.setState({
      chartData: chartData
    });
  }

  render() {
    const {
      chartData,
      isLoading,
    } = this.state;

    console.log(chartData[0].timestamp);

    return (
      <div>
        { isLoading
          ? <LoadingContent />
          : <div>
              <GardenChart chartData={chartData}/>
            </div>
        }
      </div>
    )
  }
}

const GardenChart = ({
  chartData
}) =>
  <ResponsiveContainer
    height={800}
  >
    <ScatterChart
      margin={{top: 50, right: 20, bottom: 20, left: 20}}
    >
      <XAxis
        dataKey = 'time'
        domain = {[moment('2018-05-21').unix(), moment('2018-08-31').unix()]}
        name = 'Time'
        tickFormatter = {(unixTime) => moment.unix(unixTime).format('MM/DD')}
        type = 'number'
      />
      <YAxis dataKey = 'value' name = 'Value' />
      {/* <Tooltip cursor={{ strokeDasharray: '3 3' }} /> */}
      <ReferenceLine y={20} label="1단계" stroke="gray" strokeDasharray="3 3" />
      <ReferenceLine y={40} label="2단계" stroke="gray" strokeDasharray="3 3" />
      <ReferenceLine y={60} label="3단계" stroke="gray" strokeDasharray="3 3" />
      <ReferenceLine y={80} label="4단계" stroke="gray" strokeDasharray="3 3" />
      <ReferenceLine y={100} label="5단계" stroke="gray" strokeDasharray="3 3" />
      {
        chartData.map(data => {
          return (
            <Scatter
              key={data.id}
              data={data.timestamp}
              line={{ stroke: '#ff50a0' }}
              lineJointType='monotoneX'
              lineType='joint'
              name='Values'
              fill='#ff50a0'
            >
              <LabelList dataKey='name' position='top'/>
            </Scatter>
          )
        })
      }
    </ScatterChart>
  </ResponsiveContainer>


export default D2;