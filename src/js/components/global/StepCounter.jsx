import React, {PropTypes} from 'react';
import _ from 'lodash';
import style from './stepCounter.css';

const StepCounter = React.createClass({
  propTypes: {
    steps: PropTypes.number.isRequired,
    active: PropTypes.number.isRequired
  },
  getDefaultProps(){
    return {
      steps: 3,
      active: 1
    };
  },
  getClass(i){
    return this.props.active === i + 1 ? style.bulletActive : style.bullet;
  },
  render(){
    return (
      <div className={style.counter}>
        {_.range(this.props.steps).map((n, i) => {
          return <div className={this.getClass(i)} key={`step-counter-${i}`}/>;
        })}
      </div>
    );
  }
});

export default StepCounter;