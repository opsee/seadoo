import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import {Link} from 'react-router';

import {Toolbar, LogoColor, StatusHandler} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {Grid, Col, Row} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';
import {user as actions} from '../../actions';

const Login = React.createClass({
  propTypes: {
    location: PropTypes.object,
    redux: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      login: PropTypes.func,
      setLoginData: PropTypes.func
    }).isRequired
  },
  getInitialState(){
    return {
      data: this.props.redux.user.toJS()
    };
  },
  getButtonText(){
    return this.props.redux.asyncActions.userLogin.status === 'pending' ? 'Logging In...' : 'Log In';
  },
  isDisabled(){
    const incomplete = !(this.state.data.email && this.state.data.password);
    return incomplete || this.props.redux.asyncActions.userLogin.status === 'pending';
  },
  setUserData(data){
    this.setState({data});
    this.props.actions.setLoginData(data);
  },
  handleSubmit(e){
    e.preventDefault();
    let data = this.state.data;
    if (this.props.location.query.as){
      data.as = _.parseInt(this.props.location.query.as, 10);
    }
    this.props.actions.login(data);
  },
  render() {
    return (
       <div>
        <Toolbar title="Login to Your Account"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <LogoColor/>
              <form name="loginForm" onSubmit={this.handleSubmit}>
                <UserInputs include={['email', 'password']}  onChange={this.setUserData}/>
                <StatusHandler status={this.props.redux.asyncActions.userLogin.status}/>
                <Padding t={1}>
                  <Button type="submit" color="success" block disabled={this.isDisabled()}>
                    {this.getButtonText()}
                  </Button>
                </Padding>
                <Padding tb={2}>
                  <p><Link to="/password-forgot">Forgot your password?</Link></p>
                  <p>Need an account? <Link to="/start">Sign up!</Link></p>
                </Padding>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(Login);