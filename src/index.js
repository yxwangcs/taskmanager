import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import ReactEcharts from 'echarts-for-react';
import { Icon, Tabs } from 'antd';
import './index.css';
import { requestProcessInfo } from "./actions/process-tab";
import ProcessTabContainer from './containers/process-tab';
import reducer from './reducers';


const loggerMiddleware = createLogger();

const store = createStore(
  reducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);

setInterval(() => {
  store.dispatch(requestProcessInfo());
}, 1500);


function copy(o) {
    let output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
        v = o[key];
        output[key] = (typeof v === "object") ? copy(v) : v;
    }
    return output;
}

class TaskManager extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      option: {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          splitLine: {
            show: false
          },
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          }
        },
        series: [{
          data: Array.from({length: 60}, () => Math.floor(Math.random() * 100)),
          type: 'line',
          areaStyle: {},
          showSymbol: false,
          hoverAnimation: false,
          animation: false
        }]
      }
    };
  }

  componentDidMount() {
    setInterval(() => {
      var option = copy(this.state.option);
      option.series[0].data.shift();
      option.series[0].data.push(Math.floor(Math.random() * 100));
      this.setState({
        option: option
      });
    }, 1000);
  }

  render() {
    let cpuChart = <ReactEcharts ref='echarts_react' option={this.state.option} />;
    let memoryChart = <ReactEcharts ref='echarts_react' option={this.state.option} />;
    return (
      <Tabs defaultActiveKey="1" size="small" className="tabs">
        <Tabs.TabPane className="tab-panes"
          tab={
            <span>
              <Icon type="switcher" />
              Processes
            </span>
          }
          key="1">
          <ProcessTabContainer />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <Icon type="rocket" />
              Performance
            </span>
          }
          key="2">
          <Tabs defaultActiveKey="1" tabPosition="left" size="large">
            <Tabs.TabPane tab="CPU" key="1"> {cpuChart} </Tabs.TabPane>
            <Tabs.TabPane tab="Memory" key="2"> {memoryChart}</Tabs.TabPane>
          </Tabs>
        </Tabs.TabPane>
      </Tabs>
    );
  }
}

ReactDOM.render(
  <Provider store={store}>
    <TaskManager />
  </Provider>,
  document.getElementById('root')
);
