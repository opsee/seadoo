import React, {PropTypes} from 'react';
import {Modal} from '../../modules/bootstrap';
import {plain as seed} from 'seedling';

export default React.createClass({
  propTypes: {
    style: PropTypes.string,
    children: PropTypes.node
  },
  getStyle(){
    return {
      background: this.props.style ? seed.color[this.props.style] : seed.color.warning
    };
  },
  getClassName(){
    return this.state.type || 'notify';
  },
  render() {
    return (
      <div>
        <Modal {...this.props}>
          <Modal.Body style={this.getStyle()}>
            {this.props.children}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
});