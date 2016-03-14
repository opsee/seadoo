import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Toolbar} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';
import {user as actions} from '../../actions';

const PasswordForgot = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      sendResetEmail: PropTypes.func
    }),
    redux: PropTypes.shape({
      user: PropTypes.object,
      asyncActions: PropTypes.shape({
        userSendResetEmail: PropTypes.object
      })
    })
  },
  getInitialState(){
    return {
      data: this.props.redux.user.toJS()
    };
  },
  getStatus(){
    return this.props.redux.asyncActions.userSendResetEmail.status;
  },
  getButtonText(){
    return this.getStatus() === 'pending' ? 'Sending...' : 'Send Reset Email';
  },
  isDisabled(){
    return !this.state.data.email || this.getStatus() === 'pending';
  },
  setUserData(data){
    this.setState({
      data
    });
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.actions.sendResetEmail(this.state.data);
  },
  renderInner(){
    if (this.getStatus() === 'success'){
      return (
        <p>Success. Check your email.</p>
      );
    }
    return (
      <form name="loginForm" onSubmit={this.handleSubmit}>
        <p>Simply fill in your email and we&rsquo;ll message you with a shiny reset link.</p>
        <Padding b={1}>
          <UserInputs include={['email']}  onChange={this.setUserData} email={this.state.data.email}/>
        </Padding>
        <Button type="submit" color="success" block disabled={this.isDisabled()}>
          {this.getButtonText()}
        </Button>
      </form>
    );
  },
  render() {
    return (
       <div>
        <Toolbar title="Forgot Password"/>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderInner()}
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

export default connect(null, mapDispatchToProps)(PasswordForgot);