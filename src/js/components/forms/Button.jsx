import React, {PropTypes} from 'react';
import {Link, History} from 'react-router';
import _ from 'lodash';
import Hammer from 'react-hammerjs';

import {ChevronRight} from '../icons';
import {plain as seed} from 'seedling';
import cx from 'classnames';
import style from './button.css';

const pressDuration = 1500;

const Button = React.createClass({
  mixins: [History],
  propTypes: {
    flat: PropTypes.bool,
    icon: PropTypes.bool,
    block: PropTypes.bool,
    secondary: PropTypes.bool,
    noPad: PropTypes.bool,
    fab: PropTypes.bool,
    color: PropTypes.string,
    type: PropTypes.string,
    text: PropTypes.string,
    className: PropTypes.string,
    target: PropTypes.string,
    to: PropTypes.string,
    params: PropTypes.object,
    chevron: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.node,
    title: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.object,
    sm: PropTypes.bool,
    onPressUp: PropTypes.func
  },
  getDefaultProps(){
    return {
      color: 'default',
      type: 'button'
    };
  },
  getInitialState() {
    return {
      pressStart: false,
      pressing: false
    };
  },
  getClass(){
    let arr = [];
    for (const prop in this.props){
      if (this.props[prop]){
        const selector = prop.match('color|text') ? this.props[prop] : prop;
        arr.push(style[`btn${ _.startCase(selector).split(' ').join('')}`]);
      }
    }
    arr.push(this.props.className);
    return cx(arr);
  },
  getProgressClass(){
    const pressing = this.state.pressing ? 'Pressing' : '';
    return style[`progress${ _.startCase(this.props.color)}${pressing}`];
  },
  getInnerClass(){
    return this.props.onPressUp ? style.inner : '';
  },
  getHammerOptions(){
    return {
      recognizers: {
        press: {
          time: 200,
          threshold: 300
        }
      }
    };
  },
  runResetPressing(){
    if (this.isMounted()){
      this.setState({
        pressing: 0
      });
    }
  },
  handlePress(){
    if (this.state.pressing){
      return this.runResetPressing();
    }
    if (this.isMounted()){
      this.setState({
        pressStart: Date.now(),
        pressing: 1
      });
    }
    return null;
  },
  handlePressUp(){
    if (this.state.pressStart && this.state.pressing){
      if (Date.now() - this.state.pressStart > pressDuration){
        if (typeof this.props.onPressUp === 'function'){
          this.props.onPressUp.call();
        }
      }
    }
    this.runResetPressing();
  },
  handleClick(){
    if (typeof this.props.onClick === 'function'){
      this.props.onClick();
    }
  },
  handleLinkClick(e){
    if (this.props.target && this.props.target === '_blank'){
      e.preventDefault();
      e.stopPropagation();
      window.open(this.history.createHref(this.props.to));
    }
  },
  handleKeyDown(e){
    if (e.keyCode.toString().match('13|32')){
      if (!this.state.pressing){
        this.handlePress();
      }
    }
  },
  handleKeyUp(e){
    if (e.keyCode.toString().match('13|32')){
      return this.handlePressUp();
    }
    return null;
  },
  renderChevron(){
    if (this.props.chevron){
      let fill = seed.color.text;
      if (this.props.disabled){
        fill = seed.color.text2;
      }
      return <ChevronRight inline fill={fill}/>;
    }
    return null;
  },
  renderInner(){
    return (
      <span className={this.getInnerClass()}>
        {this.props.children}
        {this.renderChevron()}
      </span>
    );
  },
  render(){
    if (this.props.to){
      return (
        <Link {...this.props} className={this.getClass()} onClick={this.handleLinkClick} title={this.props.title}>
          {this.renderInner()}
        </Link>
      );
    } else if (this.props.href){
      return (
        <a className={this.getClass()} onClick={this.props.onClick} href={this.props.href} target={this.props.target} title={this.props.title} style={this.props.style}>
          {this.renderInner()}
        </a>
      );
    } else if (this.props.onPressUp){
      return (
        <Hammer onPress={this.handlePress} onPressUp={this.handlePressUp} options={this.getHammerOptions()} onPanStart={this.runResetPressing} onSwipe={this.runResetPressing}>
          <button className={this.getClass()} type={this.props.type} disabled={this.props.disabled} title={this.props.title} style={this.props.style} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp}>
            <span className={this.getProgressClass()}/>
            {this.renderInner()}
          </button>
        </Hammer>
      );
    }
    return (
      <button className={this.getClass()} type={this.props.type} onClick={this.handleClick} disabled={this.props.disabled} title={this.props.title} style={this.props.style}>
        {this.renderInner()}
      </button>
    );
  }
});

export default Button;