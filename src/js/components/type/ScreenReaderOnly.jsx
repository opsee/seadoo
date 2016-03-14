import React, {PropTypes} from 'react';
import style from './screenReaderOnly.css';

const ScreenReaderOnly = React.createClass({
  propTypes: {
    children: PropTypes.node
  },
  render(){
    return <span className={style.span}>{this.props.children}</span>;
  }
});

export default ScreenReaderOnly;