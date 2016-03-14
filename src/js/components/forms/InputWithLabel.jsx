import React, {PropTypes} from 'react';
import Label from './Label.jsx';
import cx from 'classnames';
import _ from 'lodash';

const InputWithLabel = React.createClass({
  propTypes: {
    children: PropTypes.node,
    bf: PropTypes.object.isRequired
  },
  render(){
    let arr = ['flex-column'];
    if (this.props.children) {
      arr.push('has-icon');
    }
    if (_.get(this.props.bf, 'field.widgetAttrs.labelInside')){
      return (
        <div>
          {this.props.bf.render()}
          {this.props.children}
          <Label bf={this.props.bf} />
        </div>
      );
    }
    const style = {
      paddingRight: this.props.children ? '5rem' : 0
    };
    return (
      <div className={cx(arr)}>
        <div className="input-container flex-order-2">{this.props.bf.render({attrs: {style}})}</div>
        <Label className="flex-order-1" bf={this.props.bf} />
        {this.props.children}
      </div>
    );
  }
});

export default InputWithLabel;