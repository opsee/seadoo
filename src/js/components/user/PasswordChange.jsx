import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {StatusHandler, Toolbar} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {user as actions} from '../../actions';

const PasswordChange = React.createClass({
  propTypes: {
    location: PropTypes.object,
    history: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      edit: PropTypes.func.isRequired,
      userApply: PropTypes.func.isRequired
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        userEdit: PropTypes.object
      })
    })
  },
  getInitialState(){
    return {
      password: null
    };
  },
  componentWillMount(){
    const token = this.props.location.query.token;
    if (!this.props.location.query.id || !token){
      return this.props.history.replaceState(null, '/password-forgot');
    }
    return this.props.actions.userApply({
      loginDate: new Date(),
      token
    });
  },
  getStatus(){
    return this.props.redux.asyncActions.userEdit.status;
  },
  getButtonText(){
    return this.getStatus() === 'pending' ? 'Changing...' : 'Change';
  },
  isDisabled(){
    return !this.state.password || this.getStatus() === 'pending';
  },
  setUserData(data){
    this.setState(_.assign({}, data));
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.actions.edit(_.assign(this.state, this.props.location.query));
  },
  render() {
    return (
       <div>
        <Toolbar title="Change Your Password"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <form name="loginForm" onSubmit={this.handleSubmit}>
                <p>Enter your new password here.</p>
                <UserInputs include={['password']}  onChange={this.setUserData}/>
                <StatusHandler status={this.getStatus()}/>
                <Button color="success" block type="submit" disabled={this.isDisabled()}>
                  {this.getButtonText()}
                </Button>
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

export default connect(null, mapDispatchToProps)(PasswordChange);