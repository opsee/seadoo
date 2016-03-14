import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Grid, Row} from '../../modules/bootstrap';
import Modal from './Modal';
import {Padding} from '../layout';
import {Heading} from '../type';
import {app as actions} from '../../actions';

const ContextMenu = React.createClass({
  propTypes: {
    title: PropTypes.string,
    onHide: PropTypes.func,
    children: PropTypes.node,
    id: PropTypes.string.isRequired,
    openId: PropTypes.string,
    actions: PropTypes.shape({
      closeContextMenu: PropTypes.func
    }),
    noTitle: PropTypes.bool
  },
  getDefaultProps(){
    return {
      title: 'Menu'
    };
  },
  handleHide(){
    this.props.actions.closeContextMenu();
    if (typeof this.props.onHide === 'function'){
      this.props.onHide.call();
    }
  },
  renderTitle(){
    if (!this.props.noTitle){
      return (
        <Padding lr={1} t={2}>
          <Heading level={3}>{this.props.title}</Heading>
        </Padding>
      );
    }
    return null;
  },
  render(){
    return (
      <Modal show={this.props.openId === this.props.id} onHide={this.handleHide} className="context" style="default" key="modal">
        <Grid fluid>
          <Row>
            <div className="flex-1">
              {this.renderTitle()}
              {this.props.children}
            </div>
          </Row>
        </Grid>
      </Modal>
    );
  }
});

const mapStateToProps = (state) => ({
  openId: state.app.openContextMenu
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);