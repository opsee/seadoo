import React, {PropTypes} from 'react';
import _ from 'lodash';

const Label = React.createClass({
  propTypes: {
    bf: PropTypes.object.isRequired,
    children: PropTypes.node
  },
  renderErrors(){
    const errors = this.props.bf && this.props.bf.errors().messages().map((message, i) => {
      return (
        <div key={i}>
          {message}
        </div>
      );
    });
    if (!errors || !this.props.bf.label){
      return (
        <div>
          Bad input params.
        </div>
      );
    }
    return errors;
  },
  renderChildren(){
    if (this.props.children){
      return (
        <div style={{marginRight: '0.7em'}}>
          {this.props.children}
        </div>
      );
    }
    return null;
  },
  render(){
    if (_.get(this.props.bf, 'field.widgetAttrs.noLabel')){
      return null;
    }
    return (
      <label className="flex-order-1 label user-select-none" htmlFor={this.props.bf.idForLabel()}>
        <div className="display-flex">
          {this.renderChildren()}
          <span className="form-label" dangerouslySetInnerHTML={{__html: this.props.bf.label}}/>
          <span className="form-message">{this.renderErrors()}</span>
        </div>
      </label>
    );
  }
});

export default Label;