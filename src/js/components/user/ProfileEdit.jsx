import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import forms from 'newforms';

import {StatusHandler, Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button, BoundField} from '../forms';
import UserInputs from './UserInputs.jsx';
import {Lock, Close} from '../icons';
import {Padding} from '../layout';
import {user as actions} from '../../actions';

const PasswordForm = forms.Form.extend({
  password: forms.CharField({
    widget: forms.PasswordInput,
    label: 'New Password',
    widgetAttrs: {
      placeholder: 'Enter a new password'
    },
    required: false
  }),
  render(){
    return (
      <BoundField bf={this.boundField('password')}>
        <Lock className="icon"/>
      </BoundField>
    );
  }
});

const ProfileEdit = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      edit: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        userEdit: PropTypes.object
      }),
      user: PropTypes.object
    })
  },
  getInitialState() {
    return {
      user: this.props.redux.user.toJS(),
      passwordForm: this.getForm()
    };
  },
  getForm(){
    const self = this;
    return new PasswordForm({
      onChange(){
        self.setState({password: self.state.passwordForm.cleanedData.password});
      },
      labelSuffix: '',
      validation: {
        on: 'blur change',
        onChangeDelay: 100
      }
    });
  },
  getStatus(){
    return this.props.redux.asyncActions.userEdit.status;
  },
  isDisabled(){
    return !(this.state.user.email && this.state.user.name) ||
    this.getStatus() === 'pending';
  },
  handleUserData(data){
    let user = _.clone(this.state.user);
    user.name = data.name;
    user.email = data.email;
    this.setState({user});
  },
  handleSubmit(e){
    e.preventDefault();
    let data = this.state.user;
    if (this.state.password){
      data.password = this.state.password;
    }
    this.props.actions.edit(data);
  },
  render() {
    return (
       <div>
        <Toolbar title="Edit Your Profile" bg="info" btnPosition="midRight">
          <Button to="/profile" icon flat>
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
            <form onSubmit={this.handleSubmit}>
              <UserInputs include={['email', 'name']}  onChange={this.handleUserData} email={this.state.user.email} name={this.state.user.name}/>
              {this.state.passwordForm.render()}
              <StatusHandler status={this.getStatus()}/>
              <Padding t={2}>
                <Button color="success" type="submit" block disabled={this.isDisabled()}>
                  {this.getStatus() === 'pending' ? 'Updating...' : 'Update'}
                </Button>
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

export default connect(null, mapDispatchToProps)(ProfileEdit);