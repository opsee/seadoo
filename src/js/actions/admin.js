import _ from 'lodash';

import config from '../modules/config';
import request from '../modules/request';
import {
  ADMIN_GET_SIGNUPS,
  ADMIN_GET_CUSTOMERS,
  ADMIN_ACTIVATE_SIGNUP,
  ADMIN_DELETE_SIGNUP,
  ADMIN_DELETE_USER
} from './constants';

export function getSignups() {
  return (dispatch, state) => {
    dispatch({
      type: ADMIN_GET_SIGNUPS,
      payload: new Promise((resolve, reject) => {
        request
        .get(`${config.services.auth}/signups`)
        .set('Authorization', state().user.get('auth'))
        .query({
          per_page: 1000
        })
        .then(res => resolve(res.body), reject);
      })
    });
  };
}

export function activateSignup(signup) {
  return (dispatch, state) => {
    dispatch({
      type: ADMIN_ACTIVATE_SIGNUP,
      meta: signup.id,
      payload: new Promise((resolve, reject) => {
        request
        .put(`${config.services.auth}/signups/${signup.id}/activate`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve(res.body);
          getSignups()(dispatch, state);
        }, reject);
      })
    });
  };
}

export function deleteSignup(signup) {
  return (dispatch, state) => {
    dispatch({
      type: ADMIN_DELETE_SIGNUP,
      payload: new Promise((resolve, reject) => {
        request
        .del(`${config.services.auth}/signups/${signup.id}`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve(res.body);
          getSignups()(dispatch, state);
        }, reject);
      })
    });
  };
}

export function getCustomers() {
  return (dispatch, state) => {
    dispatch({
      type: ADMIN_GET_CUSTOMERS,
      payload: new Promise((resolve, reject) => {
        request
        .post(`${config.services.compost}/admin/graphql`)
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `{
            listCustomers(page: 1, per_page: 1000) {
              customers {
                id
                bastion_states {
                  id
                  status
                  last_seen
                }
                users {
                  id
                  name
                  email
                  verified
                  active
                  admin
                  created_at
                  updated_at
                }
              }
            }
          }`
        })
        .then(res => {
          resolve(_.get(res, 'body.data.listCustomers.customers') || []);
        }, reject);
      })
    });
  };
}

export function deleteUser(user) {
  return (dispatch, state) => {
    dispatch({
      type: ADMIN_DELETE_USER,
      payload: new Promise((resolve, reject) => {
        request
        .del(`${config.services.auth}/users/${user.id}`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve(res.body);
          getCustomers()(dispatch, state);
        }, reject);
      })
    });
  };
}