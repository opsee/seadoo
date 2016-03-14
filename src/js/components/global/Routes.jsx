import React from 'react';
import {Route} from 'react-router';
import Opsee from '../global/Opsee';

import Login from 'react-proxy?name=onboard!exports?exports.default!../user/Login';

import Signups from 'react-proxy?name=adminSignups!exports?exports.default!../admin/Signups';

import NotFound from 'react-proxy?name=notfound!exports?exports.default!../pages/NotFound';

import {auth} from '../global/Authenticator';

const routes = (
  <Route component={Opsee}>

    <Route path="/" component={auth(Signups, true)}/>

    <Route path="/login" component={Login}/>

    <Route path="*" component={NotFound}/>
  </Route>
);

export default routes;
