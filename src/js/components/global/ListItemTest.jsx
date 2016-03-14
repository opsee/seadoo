import React, {PropTypes} from 'react';
import {Record} from 'immutable';

import ListItem from './ListItem';
import {Add} from '../icons';
import {Button} from '../forms';

const itemRecord = Record({
  name: undefined,
  passing: undefined,
  total: undefined
});

const ListItemTest = React.createClass({
  propTypes: {
    state: PropTypes.string,
    passing: PropTypes.number,
    total: PropTypes.number,
    onClick: PropTypes.func,
    link: PropTypes.string,
    params: PropTypes.object,
    location: PropTypes.object
  },
  getDefaultProps() {
    return {
      state: 'running',
      passing: 0,
      total: 0,
      link: 'checks'
    };
  },
  getItem(){
    return new itemRecord(this.props);
  },
  getHealth(){
    if (this.props.total){
      return Math.floor((this.props.passing / this.props.total) * 100);
    }
    return 0;
  },
  getInfoSecondary(){
    if (this.getHealth()){
      return `${this.props.passing} of ${this.props.total} passing`;
    }
    return 'No checks applied';
  },
  render(){
    return (
      <ListItem type="Group" item={this.getItem()} link={this.props.link} onClick={this.props.onClick} state={this.props.state} passing={this.props.passing} total={this.props.total} menuTitle="Example Actions">
        <div key="menu">
          <Button color="primary" text="left" block flat>
            <Add inline fill="primary"/> Create
          </Button>
        </div>
        <div key="line1">Example Name</div>
        <div key="line2">{this.getInfoSecondary()}</div>
      </ListItem>
    );
  }
});

export default ListItemTest;