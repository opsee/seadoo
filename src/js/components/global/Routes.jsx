import React from 'react';
import {Route} from 'react-router';
import Opsee from '../global/Opsee';

import Login from 'react-proxy?name=Login!exports?exports.default!../user/Login';
import Signups from 'react-proxy?name=Signups!exports?exports.default!../admin/Signups';
import Customers from 'react-proxy?name=Customers!exports?exports.default!../admin/Customers';
import GraphQL from 'react-proxy?name=GraphQL!exports?exports.default!../admin/GraphQL';
import NotFound from 'react-proxy?name=notfound!exports?exports.default!../pages/NotFound';

import {auth} from '../global/Authenticator';

const routes = (
  <Route component={Opsee}>
    <Route path="/" component={auth(Customers, true)}/>
    <Route path="/signups" component={auth(Signups, true)}/>
    <Route path="/graphql" component={auth(GraphQL, true)}/>

    <Route path="/login" component={Login}/>

    <Route path="*" component={NotFound}/>
  </Route>
);

export default routes;