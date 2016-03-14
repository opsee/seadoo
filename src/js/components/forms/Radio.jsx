import React, {PropTypes} from 'react';
import style from './radio.css';

const Radio = React.createClass({
  propTypes: {
    on: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  },
  isActive() {
    return this.props.on ? 'active' : '';
  },
  handleTouch(e) {
    e.preventDefault();
    this.handleClick();
  },
  handleClick(e) {
    e.preventDefault();
    this.props.onChange.call(null, this.props.id, true);
  },
  render(){
    return (
      <div className={style.wrapper}>
        <button className={this.props.on ? style.radioActive : style.radio} type="button" onClick={this.handleClick} id={this.props.id}/>
      </div>
    );
  }
});

export default Radio;