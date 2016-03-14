import React, {PropTypes} from 'react';
import moment from 'moment';
import _ from 'lodash';

import {SetInterval} from '../../modules/mixins';
import style from './radialGraph.css';

const radialWidth = 40;

const RadialGraph = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    state: PropTypes.string,
    health: PropTypes.number,
    type: PropTypes.string,
    passing: PropTypes.number,
    total: PropTypes.number
  },
  getDefaultProps(){
    return {
      type: 'check'
    };
  },
  getInitialState() {
    return _.defaults({
      silenceRemaining: 0
    }, this.props);
  },
  componentDidMount(){
    this.runSetupSilence();
  },
  componentWillReceiveProps(){
    if (!this.state.silenceRemaining){
      this.runSetupSilence();
    }
  },
  getHealth(){
    return this.props.total ? Math.floor((this.props.passing / this.props.total) * 100) : undefined;
  },
  getBaseClass(){
    return style[`base${_.startCase(this.getRadialState())}`];
  },
  getInnerClass(){
    return style[`inner${_.startCase(this.getRadialState())}`];
  },
  getSvgClass(){
    return style[`svg${_.startCase(this.getRadialState())}`];
  },
  getRadialState(){
    let state = this.props.state;
    state = this.state.silenceRemaining ? 'silenced' : state;
    return state;
  },
  getTitle(){
    switch (this.state.state){
    case 'passing':
      return `This ${this.props.type} is passing.`;
    case 'failing':
      return this.state.silenceRemaining ?
      `This ${this.props.type} is running, but is ` :
      `This ${this.props.type} is failing with a health of ${this.getHealth()}%`;
    case 'running':
      return `This ${this.props.type} is currently unmonitored.`;
    case 'stopped':
      return `This ${this.props.type} is stopped in AWS.`;
    default:
      return '';
    }
  },
  getSilenceRemaining(){
    const startDate = this.state.silenceDate;
    let num = 0;
    if (startDate && startDate instanceof Date){
      const finalVal = startDate.valueOf() + this.state.silenceDuration;
      num = finalVal - Date.now();
    }
    return num > 0 ? num : 0;
  },
  getText(){
    const millis = this.state.silenceRemaining;
    if (!millis || millis < 0){
      return typeof this.getHealth() === 'number' ? this.getHealth() : '';
    }
    const duration = moment.duration(millis);
    let unit = 'h';
    let time = duration.as(unit);
    if (time < 1){
      unit = 'm';
      time = duration.as(unit);
    }
    if (time < 1){
      unit = 's';
      time = duration.as(unit);
    }
    return Math.ceil(time) + unit;
  },
  getPath(){
    const health = this.getHealth();
    if (!health){
      return '';
    }
    let percentage;
    if (this.state.silenceRemaining){
      percentage = (this.state.silenceRemaining / this.state.silenceDuration) * 100;
    } else {
      percentage = health;
    }

    if (percentage >= 100) {
      percentage = 99;
    } else if (percentage < 0) {
      percentage = 0;
    }

    percentage = parseInt(percentage, 10);
    const w = radialWidth / 2;
    const α = (percentage / 100) * 360;
    const r = ( α * Math.PI / 180 );
    const x = Math.sin( r ) * w;
    const y = Math.cos( r ) * - w;
    const mid = ( α > 180 ) ? 1 : 0;
    return `M 0 0 v -${w} A ${w} ${w} 1 ${mid} 1 ${x} ${y} z`;
  },
  getTranslate(){
    const w = radialWidth / 2;
    return `translate(${w},${w})`;
  },
  runSilence(){
    this.setState({
      silenceRemaining: this.getSilenceRemaining()
    });
  },
  runSetupSilence(){
    const remaining = this.getSilenceRemaining();
    if (remaining){
      this.setInterval(this.runSilence, 1000);
      this.runSilence();
    } else {
      this.intervals.map(clearInterval);
    }
  },
  render() {
    if (!this.state.state){
      return <div>No state defined.</div>;
    }
    return (
      <div className={this.getBaseClass()} title={this.getTitle()}>
        <svg className={this.getSvgClass()}>
          <path transform={this.getTranslate()} d={this.getPath()}/>
        </svg>
        <div className={this.getInnerClass()}>{this.getText()}</div>
    </div>
    );
  }
});

export default RadialGraph;