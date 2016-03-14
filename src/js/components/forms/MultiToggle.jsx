import React, {PropTypes} from 'react';
import ToggleWithLabel from './ToggleWithLabel.jsx';
import _ from 'lodash';

const MultiToggle = React.createClass({
  propTypes: {
    bf: PropTypes.object.isRequired
  },
  getInitialState(){
    return {
      data: this.props.bf.value()
    };
  },
  isWidgetActive(w){
    return _.find(this.props.bf.value(), w.choiceValue);
  },
  handleChange(id){
    let data = this.props.bf.value() || [];
    if (_.find(data, id)){
      data = _.pull(data, id);
    } else {
      data.push(id);
    }
    let obj = {};
    obj[this.props.bf.name] = data;
    this.props.bf.form.setData(obj);
  },
  render(){
    return (
      <ul className="list-unstyled">
        {this.props.bf.subWidgets().map((w, i) => {
          return (
            <li key={i}>
              <ToggleWithLabel on={this.isWidgetActive(w) ? true : false} onChange={this.handleChange} id={w.choiceValue} label={`${w.choiceLabel}`}/>
            </li>
          );
        })}
      </ul>
    );
  }
});

export default MultiToggle;