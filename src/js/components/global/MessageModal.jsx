import React, {PropTypes} from 'react';
import {plain as seed} from 'seedling';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Modal} from '../../modules/bootstrap';
import {app as actions} from '../../actions';

const MessageModal = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      modalMessageClose: PropTypes.func
    }),
    redux: PropTypes.shape({
      app: PropTypes.shape({
        modalMessage: PropTypes.shape({
          html: PropTypes.object,
          color: PropTypes.object,
          show: PropTypes.bool
        })
      })
    })
  },
  getStyle(){
    const color = this.props.redux.app.modalMessage.color;
    return {
      background: color ? seed.color[color] : seed.color.warning
    };
  },
  handleHide(){
    this.props.actions.modalMessageClose();
  },
  render() {
    return (
      <div>
        <Modal show={!!this.props.redux.app.modalMessage.show} onHide={this.handleHide} className="notify">
          <Modal.Body style={this.getStyle()}>
            <div dangerouslySetInnerHTML={{__html: this.props.redux.app.modalMessage.html}}/>
          </Modal.Body>
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageModal);