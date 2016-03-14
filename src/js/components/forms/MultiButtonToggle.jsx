import React, {PropTypes} from 'react';
import ButtonToggle from './ButtonToggle.jsx';
import _ from 'lodash';
import {Padding} from '../layout';

const MultiButtonToggle = React.createClass({
  propTypes: {
    bf: PropTypes.object.isRequired
  },
  getInitialState(){
    return {
      data: this.props.bf.value()
    };
  },
  isWidgetActive(w){
    return !!(_.find(this.props.bf.value(), w.choiceValue));
  },
  handleChange(id){
    let data = this.props.bf.value() || [];
    let obj = {};
    if (_.find(data, id)){
      data = _.pull(data, id);
    } else {
      data.push(id);
    }
    obj[this.props.bf.name] = data;
    const combined = _.assign({}, this.props.bf.form.cleanedData, obj);
    this.props.bf.form.setData(combined);
  },
  render(){
    return (
      <ul className="list-unstyled flex-wrap flex-vertical-align justify-content-center">
        {this.props.bf.subWidgets().map((w, i) => {
          return (
            <li key={i} style={{margin: '0 .5em'}}>
              <Padding tb={1}>
                <ButtonToggle on={this.isWidgetActive(w)} onChange={this.handleChange} id={w.choiceValue} label={`${w.choiceLabel}`}/>
              </Padding>
            </li>
          );
        })}
      </ul>
    );
  }
});

export default MultiButtonToggle;