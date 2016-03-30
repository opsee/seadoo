import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import GraphiQL from 'graphiql';
import graphistyle from 'graphiql/graphiql.css';
import style from './graphql.css';

const Page = React.createClass({
  getFetch(params){
    return fetch('https://compost.in.opsee.com/graphql', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.props.redux.user.get('auth')
      },
      body: JSON.stringify(params),
    }).then(response => response.json());
  },
  render(){
    return (
      <div className={style.container}>
        <GraphiQL fetcher={this.getFetch}/>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

export default connect(mapStateToProps)(Page);