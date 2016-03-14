import React, {PropTypes} from 'react';
import _ from 'lodash';
import {plain as seed} from 'seedling';
import style from './progressBar.css';

export default React.createClass({
  propTypes: {
    percentage: PropTypes.number.isRequired,
    steps: PropTypes.number
  },
  getDefaultProps(){
    return {
      steps: 7
    };
  },
  getBg(){
    const {color} = seed;
    if (this.props.percentage >= 100){
      return color.success;
    } else if (this.props.percentage === 0){
      return color.warning;
    } else if (this.props.percentage === -1){
      return color.danger;
    }
    return color.primary;
  },
  getWidth(){
    if (this.props.percentage === 0 || this.props.percentage === -1){
      return 100;
    }
    return this.props.percentage;
  },
  render() {
    return (
     <div className={style.progress}>
        <div className={style.bar} style={{width: `${this.getWidth()}%`, background: this.getBg()}}></div>
        <div className={style.ticks}>
          {_.range(this.props.steps - 1).map(i => {
            return (
              <div className={style.tick} style={{margin: `0 ${100 / this.props.steps / 2}%`}} key={`progress-bar-${i}`}/>
            );
          })}
        </div>
      </div>
    );
  }
});