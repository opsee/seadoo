import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {SetInterval} from '../../modules/mixins';
import {Analytics, Header, MessageModal} from './';
import DocumentTitle from 'react-document-title';
/* eslint-disable no-unused-vars */
import {yeller} from '../../modules';

import reset from './reset.css';
import style from './global.css';
import alert from './alert.css';
import modal from './modal.css';
import forms from '../forms/forms.css';
import grid from '../layout/grid.css';
import layout from '../layout/layout.css';

import {app as appActions, user as userActions, env as envActions} from '../../actions';
/* eslint-enable no-unused-vars */

const hideNavList = ['^\/start', '^\/login', '^\/check-create', '^\/check\/edit', '^\/check\/.*\/event', '^\/profile\/edit', '^\/password-forgot'];

const Opsee = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    location: PropTypes.object,
    children: PropTypes.node,
    appActions: PropTypes.shape({
      initialize: PropTypes.func,
      shutdown: PropTypes.func
    }),
    userActions: PropTypes.shape({
      refresh: PropTypes.func
    }),
    redux: PropTypes.object,
    envActions: PropTypes.shape({
      getBastions: PropTypes.func.isRequired
    })
  },
  componentWillMount(){
    this.props.appActions.initialize();
    this.setInterval(this.props.userActions.refresh, (1000 * 60 * 14));
    yeller.configure(this.props.redux);
  },
  componentWillReceiveProps(nextProps) {
    //user log out
    if (!nextProps.redux.user.get('auth') && this.props.redux.user.get('auth')){
      this.props.appActions.shutdown();
    }
    //user log in
    if (nextProps.redux.user.get('auth') && !this.props.redux.user.get('auth')){
      this.props.appActions.initialize();
      this.props.envActions.getBastions();
    }
  },
  getMeatClass(){
    return this.shouldHideNav() ? style.meatUp : style.meat;
  },
  shouldHideNav(){
    return !!(_.find(hideNavList, string => this.props.location.pathname.match(string)));
  },
  renderInner(){
    if (!this.props.redux.app.ready){
      return null;
    }
    return React.cloneElement(this.props.children, _.assign({},
      {
        redux: this.props.redux
      })
    );
  },
  render() {
    return (
      <div>
        <DocumentTitle title="Opsee"/>
        <Header user={this.props.redux.user} hide={this.shouldHideNav()}/>
        <Analytics/>
        <div className={this.getMeatClass()}>
          {this.renderInner()}
        </div>
        <MessageModal/>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  appActions: bindActionCreators(appActions, dispatch),
  userActions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Opsee);
