import React, {PropTypes} from 'react';
import style from './toggle.css';

const Toggle = React.createClass({
  propTypes: {
    on: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  },
  getToggleClass(){
    return this.props.on ? style.toggleSwitchActive : style.toggleSwitch;
  },
  getKnobClass(){
    return this.props.on ? style.toggleKnobActive : style.toggleKnob;
  },
  handleClick(){
    this.props.onChange.call(null, this.props.id, !this.props.on);
  },
  handleTouch(e){
    e.preventDefault();
    this.handleClick();
  },
  render(){
    return (
      <div className={this.getToggleClass()} onClick={this.handleClick} onTouchEnd={this.handleTouch}>
        <button className={this.getKnobClass()} id={this.props.id}/>
      </div>
    );
  }
});

export default Toggle;