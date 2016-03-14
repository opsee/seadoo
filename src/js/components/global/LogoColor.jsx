import React from 'react';
import img from '../../../img/logo-color-border-light.svg';
import style from './logoColor.css';
import {Padding} from '../layout';

const LogoColor = React.createClass({
  render() {
    return (
      <Padding tb={1}>
         <div style={{textAlign: 'center'}}>
           <img src={img} alt="Opsee logo" className={style.logo}/>
         </div>
       </Padding>
    );
  }
});

export default LogoColor;