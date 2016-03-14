import React, {PropTypes} from 'react';
import style from './color.css';

const Color = React.createClass({
  propTypes: {
    children: PropTypes.node,
    c: PropTypes.string
  },
  getDefaultProps(){
    return {
      c: 'white'
    };
  },
  render(){
    return <span className={style[this.props.c]}>{this.props.children}</span>;
  }
});

export default Color;