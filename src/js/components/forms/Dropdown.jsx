import React, {PropTypes} from 'react';
import _ from 'lodash';
import uuid from 'uuid-v4';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Label from './Label.jsx';
import Button from './Button';
import {ChevronDown, ChevronUp} from '../icons';
import style from './dropdown.css';
import {
  app as actions
} from '../../actions';

const Dropdown = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      setDropdownId: PropTypes.func
    }),
    bf: PropTypes.object.isRequired,
    id: PropTypes.string,
    redux: PropTypes.shape({
      app: PropTypes.shape({
        dropdownId: PropTypes.any
      })
    })
  },
  getInitialState(){
    return this.getState();
  },
  componentDidMount(){
    const val = this.props.bf.value();
    if (val){
      const obj = {};
      obj[this.state.bf.name] = val;
      this.state.bf.form.updateData(obj);
    }
    /*eslint-disable react/no-did-mount-set-state*/
    /*not sure how else to set this id so that it will be unique across multiple dropdown components*/
    this.setState({
      id: uuid()
    });
    /*eslint-enable react/no-did-mount-set-state*/
  },
  componentWillReceiveProps(){
    this.setState(this.getState());
  },
  getState(){
    let label = this.props.bf.value();
    if (label){
      label = this.getLabelFromChoice(label);
    } else {
      label = _.clone(this.props.bf.label);
    }
    return _.extend({}, this.props, {
      label: label,
      open: false
    });
  },
  getLabelFromChoice(key){
    let bf = this.state && this.state.bf || this.props.bf;
    let choice = _.find(bf.field._choices, c => c[0] === key);
    if (choice && Array.isArray(choice)){
      choice = choice[1];
    }
    return choice;
  },
  isOpen(){
    return this.props.redux.app.dropdownId === this.state.id;
  },
  onSelect(choice){
    const obj = {};
    obj[this.state.bf.name] = choice[0];
    this.state.bf.form.updateData(obj);
    this.setState({
      label: choice[1]
    });
    this.props.actions.setDropdownId(undefined);
  },
  handleClick(){
    this.props.actions.setDropdownId(this.isOpen() ? undefined : this.state.id);
  },
  renderChevron(){
    if (this.isOpen()){
      return (
        <ChevronUp style={{position: 'absolute', right: '10px', top: '10px'}}/>
      );
    }
    return (
      <ChevronDown style={{position: 'absolute', right: '10px', top: '10px'}}/>
    );
  },
  renderMenu(){
    if (this.isOpen()){
      return (
        <div className={style.menu}>
          {
            this.props.bf.field._choices.map((choice, i) => {
              return (
                <Button block color="dark" dropdown key={`${this.props.bf.idForLabel}-menu-item-${i}`} onClick={this.onSelect.bind(null, choice)}>
                {choice[1]}
                </Button>
              );
            })
          }
        </div>
      );
    }
    return null;
  },
  render(){
    return (
      <div id={this.props.bf.idForLabel()}>
          <Label bf={this.props.bf}/>
          <div style={{position: 'relative'}}>
            <Button id={this.props.bf.idForLabel()} color="dark" dropdown className="flex-order-2" onClick={this.handleClick} block bsRole="toggle">
              {this.state.label}
              {this.renderChevron()}
            </Button>
            {this.renderMenu()}
        </div>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Dropdown);