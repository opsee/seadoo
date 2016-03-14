import React, {PropTypes} from 'react';
import style from './padding.css';
import cx from 'classnames';

const availProps = ['t', 'b', 'tb', 'l', 'r', 'lr', 'a'];
let types = {
  inline: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object
};
availProps.forEach(string => {
  types[string] = PropTypes.number;
});

const Padding = React.createClass({
  propTypes: types,
  getClass(){
    let arr = [];
    for (const prop in this.props){
      if (availProps.indexOf(prop) > -1){
        let num = this.props[prop];
        if (num === 0.5){
          num = 'half';
        }
        if (num === 1){
          num = '';
        }
        arr.push(style[`p${prop}${num}`]);
      }
    }
    if (!arr.length){
      arr.push(style.pa);
    }
    arr.push(this.props.className);
    return cx(arr);
  },
  render(){
    if (this.props.inline){
      return (
        <span className={this.getClass()} style={this.props.style}>
          {this.props.children}
        </span>
      );
    }
    return (
      <div className={this.getClass()} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
});

export default Padding;