import React, {PropTypes} from 'react';
import {plain as seed} from 'seedling';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TimeAgo from 'react-timeago';

import {Toolbar} from 'emissary/src/js/components/global';
import {Checkmark, Delete, Lock, Person, Mail, Ghost} from 'emissary/src/js/components/icons';
import {Grid, Row, Col} from 'emissary/src/js/modules/bootstrap';
import {Button} from 'emissary/src/js/components/forms';
import {Padding} from 'emissary/src/js/components/layout';
import {Color, Heading} from 'emissary/src/js/components/type';
import {admin as actions, user as userActions, app as appActions} from '../../actions';

const Signups = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getSignups: PropTypes.func,
      activateSignup: PropTypes.func,
      getCustomers: PropTypes.func,
      deleteSignup: PropTypes.func,
      deleteUser: PropTypes.func
    }),
    appActions: PropTypes.shape({
      modalMessageOpen: PropTypes.func
    }),
    userActions: PropTypes.shape({
      logout: PropTypes.func
    }),
    redux: PropTypes.shape({
      admin: PropTypes.shape({
        signups: PropTypes.object,
        customers: PropTypes.object
      })
    })
  },
  componentWillMount(){
    this.props.actions.getCustomers();
  },
  getCustomers(){
    return this.props.redux.admin.customers.toJS();
  },
  runGhostAccount(signup){
    this.props.userActions.logout({as: signup.id});
  },
  runDeleteUser(){
  /*eslint-disable no-alert*/
    return window.alert('this does nothing right now');
    // if (window.confirm(`Delete ${user.email} (#${user.userId || user.id})?`)){
    //   this.props.actions.deleteUser(user);
    // }
    /*eslint-enable no-alert*/
  },
  renderButton(signup){
    if (this.isUnapprovedSignup(signup)){
      return (
        <div className="display-flex">
          <div className="flex-1">
            <Button flat color="danger" sm onClick={this.runDeleteSignup.bind(null, signup)} title="Delete this signup"><Delete fill="danger"/></Button>
          </div>
          <div>
            <Button flat color="success" onClick={this.runActivateSignup.bind(null, signup)}><Checkmark fill="success" inline/> Activate</Button>
          </div>
        </div>
      );
    }
    return (
      <div className="display-flex">
        <div className="flex-1">
          <Button flat color="danger" sm onClick={this.runDeleteSignup.bind(null, signup)} title="Delete this signup"><Delete fill="danger"/></Button>
        </div>
        <div>
          <Button flat color="primary" onClick={this.runActivateSignup.bind(null, signup)}><Mail fill="primary" inline/> Resend Email</Button>
        </div>
      </div>
    );
  },
  renderReferrer(user){
    if (user.referrer){
      return (
        <div>
          <strong>Referrer: </strong>{user.referrer}
        </div>
      );
    }
    return null;
  },
  renderBastionInfo(customer){
    const bastion = _.chain(customer).get('bastion_states').sortBy(b => {
      return -1 * b.last_seen;
    }).head().value() || {};
    if (bastion.last_seen){
      const color = bastion.status === 'active' ? 'success' : 'danger';
      return (
        <div>
          <strong>Bastion ID:</strong>&nbsp;{bastion.id}<br/>
          <strong>Bastion Status:&nbsp;</strong><Color c={color}>{bastion.status}</Color><br/>
          <strong>Bastion Last Seen:</strong>&nbsp;<TimeAgo date={new Date(bastion.last_seen)}/>
        </div>
      );
    }
    return null;
  },
  renderCustomer(customer){
    const user = _.get(customer, 'users[0]') || {};
    const icon = user.admin ?
    (
      <span title="User is Admin"><Lock fill="gray500" inline/></span>
    ) : null;
    return (
      <Col xs={12} key={`customer-${_.uniqueId()}`}>
        <Padding tb={1}>
          <div style={{background: seed.color.gray9}}>
            <Padding a={1}>
              <Heading level={3}>
                {icon}&nbsp;{user.name}&nbsp;-&nbsp;<a href={'mailto:' + user.email}>{user.email}</a>
              </Heading>
              <Padding b={1}>
                <strong>User ID:</strong>&nbsp;{user.id}<br/>
                <strong>Customer ID:</strong>&nbsp;{customer.id}<br/>
                {this.renderBastionInfo(customer)}
                <div><strong>Customer Created:</strong>&nbsp;<TimeAgo date={user.created_at}/></div>
                {this.renderReferrer(user)}
                <Padding t={1} className="display-flex">
                  <div className="flex-1">
                    <Button flat color="danger" sm onClick={this.runDeleteUser.bind(null, user)} title="Delete this user"><Delete fill="danger"/></Button>
                  </div>
                  <div>
                    <Button flat color="warning" target="_blank" href={`https://app.opsee.com/login?as=${user.id}`}><Ghost fill="warning" inline/> Ghost</Button>
                  </div>
                </Padding>
              </Padding>
            </Padding>
          </div>
        </Padding>
      </Col>
    );
  },
  render() {
    return (
      <div>
        <Toolbar title="Customers"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={1}>
                <Heading level={3}><Person fill={seed.color.text2} inline/> Customers</Heading>
                <div className="display-flex-sm flex-wrap">
                  {this.getCustomers().map(this.renderCustomer)}
                </div>
              </Padding>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  userActions: bindActionCreators(userActions, dispatch),
  appActions: bindActionCreators(appActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Signups);