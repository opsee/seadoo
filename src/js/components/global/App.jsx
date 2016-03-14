import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {pushState, ReduxRouter} from 'redux-router';

import routes from './Routes.jsx';

if (process.env.NODE_ENV !== 'production'){
  window._ = _;
}

const App = React.createClass({
  render(){
    return (
      <ReduxRouter>{routes}</ReduxRouter>
    );
  }
});

export default connect(null, {pushState})(App);