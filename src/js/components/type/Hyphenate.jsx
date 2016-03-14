import React, {PropTypes} from 'react';
import style from './hyphenate.css';

const Hyphenate = React.createClass({
  propTypes: {
    children: PropTypes.node
  },
  render(){
    return <span className={style.hyphenate}>{this.props.children}</span>;
  }
});

export default Hyphenate;