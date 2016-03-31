import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import GraphiQL from 'graphiql';
/*eslint-disable no-unused-vars*/
import graphistyle from 'graphiql/graphiql.css';
/*eslint-enable no-unused-vars*/
import style from './graphql.css';
import config from 'modules/config';

const Page = React.createClass({
  propTypes: {
    redux: PropTypes.shape({
      user: PropTypes.object
    }).isRequired
  },
  getInitialState() {
    return {
      token: null
    };
  },
  getAuth(){
    const string = this.state.token;
    if (string){
      return `Bearer ${this.state.token}`;
    }
    return this.props.redux.user.get('auth');
  },
  getFetch(params){
    return fetch(
      `${config.services.compost}/admin/graphql`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuth()
        },
        body: JSON.stringify(_.pick(params, ['query']))
      }).then(response => response.json());
  },
  handleInputChange(e){
    this.setState({
      [e.target.id]: e.target.value
    });
  },
  render(){
    return (
      <div>
        <input type="text" onChange={this.handleInputChange} placeholder="🐻 Token" id="token" style={{lineHeight: '2.3rem'}}/>
        <div className={style.container}>
          <GraphiQL fetcher={this.getFetch}/>
        </div>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

export default connect(mapStateToProps)(Page);