import React, {PropTypes} from 'react';
import {plain as seed} from 'seedling';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TimeAgo from 'react-timeago';

import {Toolbar} from 'emissary/src/js/components/global';
import {Checkmark, Delete, Mail} from 'emissary/src/js/components/icons';
import {Grid, Row, Col} from 'emissary/src/js/modules/bootstrap';
import {Button} from 'emissary/src/js/components/forms';
import {Padding} from 'emissary/src/js/components/layout';
import {Heading} from 'emissary/src/js/components/type';
import {admin as actions, user as userActions, app as appActions} from '../../actions';

const Activations = React.createClass({
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
    this.props.actions.getSignups();
  },
  getData(){
    const signups = this.props.redux.admin.signups.toJS();
    return _.chain(signups).map(s => {
      let d = s.created_at;
      if (typeof d === 'string'){
        d = new Date(Date.parse(d));
      } else {
        d = new Date(d);
      }
      s.created_at = d;
      return s;
    }).sortBy(s => {
      return -1 * s.created_at;
    }).value();
  },
  getApproved(){
    return _.filter(this.getData(), this.isApprovedSignup);
  },
  isApprovedSignup(s){
    return s.activated && !s.claimed;
  },
  runActivateSignup(signup){
    this.props.actions.activateSignup(signup);
  },
  runDeleteSignup(signup){
    /*eslint-disable no-alert*/
    if (window.confirm(`Delete ${signup.email} (#${signup.id})?`)){
      this.props.actions.deleteSignup(signup);
    }
  },
  renderItem(signup){
    return (
      <Col xs={12} sm={6} key={`activation-${_.uniqueId()}`}>
        <Padding tb={1}>
          <div style={{background: seed.color.gray9}}>
            <Padding a={1}>
              <Heading level={3}>
                <Checkmark fill="textSecondary" inline/>&nbsp;{signup.name}
              </Heading>
              <Padding b={1}>
                <div>
                  <a href={'mailto:' + signup.email}>{signup.email}</a>
                  {signup.admin ? '  [admin]' : ''}
                </div>
                <div>#{`${signup.userId || signup.id}`} - <TimeAgo date={signup.created_at}/></div>
                <div>{signup.referrer && `Referrer: ${signup.referrer}`}</div>
              </Padding>
              <div className="display-flex">
                <div className="flex-1">
                  <Button flat color="danger" sm onClick={this.runDeleteSignup.bind(null, signup)} title="Delete this signup"><Delete fill="danger"/></Button>
                </div>
                <div>
                  <Button flat color="primary" onClick={this.runActivateSignup.bind(null, signup)}><Mail fill="primary" inline/> Resend Email</Button>
                </div>
              </div>
            </Padding>
          </div>
        </Padding>
      </Col>
    );
  },
  render() {
    return (
      <div>
        <Toolbar title={`Activations - ${this.getApproved().length}`}/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={1} className="display-flex-sm flex-wrap">
                {this.getApproved().map(this.renderItem)}
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

export default connect(mapStateToProps, mapDispatchToProps)(Activations);