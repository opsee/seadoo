import React, {PropTypes} from 'react';
import _ from 'lodash';

import InputWithLabel from './InputWithLabel.jsx';
import DeleteFormButton from './DeleteFormButton.jsx';
import Dropdown from './Dropdown.jsx';
import RadioSelect from './RadioSelect.jsx';
import MultiButtonToggle from './MultiButtonToggle.jsx';
import InlineRadioSelect from './InlineRadioSelect.jsx';

const BoundField = React.createClass({
  propTypes: {
    bf: PropTypes.object,
    children: PropTypes.node,
    className: PropTypes.string
  },
  renderInner(){
    const type = _.get(this.props.bf, 'field.widget.attrs.widgetType');
    switch (type){
    case 'InlineRadioSelect':
      return <InlineRadioSelect bf={this.props.bf}/>;
    case 'RadioSelect':
      return <RadioSelect bf={this.props.bf}/>;
    case 'Dropdown':
      return (
        <div className="form-group">
          <Dropdown bf={this.props.bf}/>
        </div>
      );
    case 'MultiButtonToggle':
      return <MultiButtonToggle bf={this.props.bf}/>;
    default:
      break;
    }
    if (_.get(this.props.bf, 'field.label') === 'Delete'){
      return <DeleteFormButton bf={this.props.bf}/>;
    }
    return (
      <div className="form-group">
        <InputWithLabel bf={this.props.bf}>
          {this.props.children}
        </InputWithLabel>
      </div>
    );
  },
  render(){
    return (
      <div className={this.props.className}>
        {this.renderInner()}
      </div>
    );
  }
});

export default BoundField;