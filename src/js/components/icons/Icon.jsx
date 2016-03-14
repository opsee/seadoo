import React, {PropTypes} from 'react';
import style from './icon.css';
import cx from 'classnames';
import _ from 'lodash';

import BaseSVG from './BaseSVG.jsx';

const Icon = React.createClass({
  propTypes: {
    path: PropTypes.string.isRequired,
    //fill is either a named opsee color, or any css color
    fill: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string
  },
  getColorClassFromProp(prop){
    const cased = _.startCase(this.props[prop]).split(' ').join('');
    return style[`fill${cased}`];
  },
  getClass(){
    let arr = [];
    for (const prop in this.props){
      if (prop === 'fill'){
        arr.push(this.getColorClassFromProp(prop));
      } else {
        arr.push(style[prop]);
      }
    }
    arr.push(this.props.className);
    return cx(arr);
  },
  getFill(){
    const colorClass = this.getColorClassFromProp('fill');
    if (!colorClass){
      return this.props.fill;
    }
    return false;
  },
  render(){
    return (
      <BaseSVG className={this.getClass()} style={this.props.style} fill={this.getFill()} path={this.props.path} title={this.props.title}/>
    );
  }
});

export default Icon;