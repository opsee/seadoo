import React, {PropTypes} from 'react';
import _ from 'lodash';
import Radio from './Radio.jsx';
import {plain as seed} from 'seedling';

const RadioWithLabel = React.createClass({
  propTypes: {
    on: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    label: PropTypes.string.isRequired,
    labelStyle: PropTypes.object
  },
  getStyle(){
    let style = {
      paddingLeft: '1rem'
    };
    if (this.props.on){
      style.color = seed.color.primary;
    }
    return style;
  },
  render(){
    return (
      <div className="display-flex align-items-center">
        <Radio on={this.props.on} onChange={this.props.onChange} id={this.props.id} />
        <div className="flex-1">
          <label className="label user-select-none" style={_.assign(this.getStyle(), this.props.labelStyle)} htmlFor={this.props.id}>
            <span dangerouslySetInnerHTML={{__html: this.props.label}}/>
          </label>
        </div>
      </div>
    );
  }
});

export default RadioWithLabel;