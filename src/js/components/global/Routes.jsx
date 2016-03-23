import React from 'react';
import {Route} from 'react-router';
import Opsee from '../global/Opsee';

import Login from 'react-proxy?name=Login!exports?exports.default!../user/Login';
import Signups from 'react-proxy?name=Signups!exports?exports.default!../admin/Signups';
import Activations from 'react-proxy?name=Activations!exports?exports.default!../admin/Activations';
import Users from 'react-proxy?name=Users!exports?exports.default!../admin/Users';
import NotFound from 'react-proxy?name=notfound!exports?exports.default!../pages/NotFound';

import {auth} from '../global/Authenticator';

const routes = (
  <Route component={Opsee}>
    <Route path="/" component={auth(Users, true)}/>
    <Route path="/signups" component={auth(Signups, true)}/>
    <Route path="/activations" component={auth(Activations, true)}/>

    <Route path="/login" component={Login}/>

    <Route path="*" component={NotFound}/>
  </Route>
);

export default routes;
