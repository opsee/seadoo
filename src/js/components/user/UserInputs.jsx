import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import {BoundField} from '../forms';
import {Mail, Person, Lock} from '../icons';
import {Padding} from '../layout';

let include = [];

const InfoForm = forms.Form.extend({
  email: forms.CharField({
    validators: [forms.validators.validateEmail],
    widgetAttrs: {
      placeholder: 'address@domain.com',
      autoCapitalize: 'off',
      autoCorrect: 'off'
    }
  }),
  name: forms.CharField({
    widgetAttrs: {
      placeholder: 'Your Name',
      icon: 'Person'
    }
  }),
  password: forms.CharField({
    widget: forms.PasswordInput,
    widgetAttrs: {
      placeholder: 'Your Password',
      icon: 'Lock'
    }
  }),
  render() {
    return (
      <div>
      {
        include.map(field => {
          return <BoundField bf={this.boundField(field)} key={field}/>;
        })
      }
      </div>
    );
  }
});

export default React.createClass({
  propTypes: {
    include: PropTypes.array.isRequired
  },
  componentWillMount(){
    include = this.props.include;
  },
  getDefaultProps(){
    return {
      email: '',
      name: '',
      password: ''
    };
  },
  getInitialState() {
    const self = this;
    return {
      info: new InfoForm(_.extend({
        onChange(){
          self.props.onChange(self.state.info.cleanedData, this.isComplete());
          self.forceUpdate();
        },
        labelSuffix: '',
        validation: {
          on: 'blur change',
          onChangeDelay: 300
        }
      }, self.getCompleteData()))
    };
  },
  getCompleteData(){
    const test = _.chain(this.props.include).map(s => this.props[s]).some().value();
    if (test){
      return {
        data: _.cloneDeep(this.props)
      };
    }
    return null;
  },
  renderEmail(){
    return (
       <BoundField bf={this.state.info.boundField('email')}>
        <Mail className="icon"/>
       </BoundField>
    );
  },
  renderPassword(){
    return (
       <BoundField bf={this.state.info.boundField('password')}>
        <Lock className="icon"/>
       </BoundField>
    );
  },
  renderName(){
    return (
       <BoundField bf={this.state.info.boundField('name')}>
        <Person className="icon"/>
       </BoundField>
    );
  },
  render() {
    return (
      <div>
        {this.props.include.map(i => {
          return (
            <Padding b={1} key={`padding-${i}`}>
              {this[`render${_.capitalize(i)}`]()}
            </Padding>
          );
        })}
      </div>
    );
  }
});