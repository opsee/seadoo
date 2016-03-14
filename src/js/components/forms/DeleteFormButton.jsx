import React, {PropTypes} from 'react';
import Button from './Button.jsx';
import {Delete} from '../icons';
import {Padding} from '../layout';

const DeleteFormButton = React.createClass({
  propTypes: {
    bf: PropTypes.object.isRequired
  },
  getInitialState(){
    return {
      data: this.props.bf.value()
    };
  },
  handleChange(){
    let old = this.props.bf.form.cleanedData.DELETE;
    this.props.bf.form.updateData({
      DELETE: !old
    });
  },
  render(){
    return (
      <Padding t={0.5}>
        <Button flat color="danger" className="pull-right" title="Remove this Header" onClick={this.handleChange}>
          <Delete inline fill="danger"/>
        </Button>
      </Padding>
    );
  }
});

export default DeleteFormButton;