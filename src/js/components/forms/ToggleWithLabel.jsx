import React, {PropTypes} from 'react';
import Toggle from './Toggle.jsx';
import style from './toggleWithLabel.css';

export default React.createClass({
  propTypes: {
    on: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    label: PropTypes.string.isRequired
  },
  render(){
    return (
      <div className={style.toggle}>
        <Toggle className={style.toggleSwitch} on={this.props.on} onChange={this.props.onChange} id={this.props.id} />
        <div className="flex-1">
          <label className={style.toggleLabel} onClick={this.props.onChange.bind(null, this.props.id, !this.props.on)} htmFor={this.props.id}>
            {this.props.label}
          </label>
        </div>
      </div>
    );
  }
});