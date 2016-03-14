import React, {PropTypes} from 'react';
import RadioWithLabel from './RadioWithLabel.jsx';
import {plain as seed} from 'seedling';
import {Padding} from '../layout';

const InlineRadioSelect = React.createClass({
  propTypes: {
    bf: PropTypes.object.isRequired
  },
  componentDidMount(){
    const val = this.props.bf.value();
    if (val){
      const obj = {};
      obj[this.props.bf.name] = val;
      this.props.bf.form.updateData(obj);
    }
    if (this.props.bf.field.initial && Array.isArray(this.props.bf.field.initial) && !this.props.bf.data()){
      this.handleChange(this.props.bf.field.initial[0], true);
    }
  },
  getInitialState(){
    return {
      data: this.props.bf.value()
    };
  },
  isWidgetActive(w){
    const val = this.props.bf.value();
    if (val && Array.isArray(val)){
      return val[0] === w.choiceValue;
    }
    return false;
  },
  handleChange(id, bool){
    const data = bool ? [id] : [];
    let obj = {};
    obj[this.props.bf.name] = data;
    return this.props.bf.form.updateData(obj, {
      clearValidation: false
    });
  },
  render(){
    return (
      <div className="form-group">
        <label className="label">{this.props.bf.label}</label>
        <Padding a={0.5}>
          <ul className="list-unstyled flex-wrap">
            {this.props.bf.subWidgets().map((w, i) => {
              return (
                <li key={i} style={{marginRight: '1.8em'}}>
                  <RadioWithLabel on={this.isWidgetActive(w) ? true : false} onChange={this.handleChange} id={w.choiceValue} label={`${w.choiceLabel}`} labelStyle={{marginTop: '-.2rem', color: seed.color.text}}/>
                </li>
              );
            })}
          </ul>
        </Padding>
      </div>
    );
  }
});

export default InlineRadioSelect;