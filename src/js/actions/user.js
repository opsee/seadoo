import {pushState} from 'redux-router';
import {createAction} from 'redux-actions';
import config from '../modules/config';
import request from '../modules/request';
import _ from 'lodash';
import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_REFRESH,
  USER_EDIT,
  USER_SET_PASSWORD,
  USER_GET_CUSTOMER,
  USER_GET_DATA,
  USER_PUT_DATA,
  USER_SEND_RESET_EMAIL,
  USER_APPLY,
  USER_SET_LOGIN_DATA
} from './constants';
import storage from '../modules/storage';

export function login(data) {
  return (dispatch, state) => {
    dispatch({
      type: USER_LOGIN,
      payload: new Promise((resolve, reject) => {
        request
        .post(`${config.services.auth}/authenticate/password`)
        .send(data)
        .then((res) => {
          resolve(res.body);
          //TODO fix this somehow
          setTimeout(() => {
            const string = state().router.location.query.redirect || '/';
            dispatch(pushState(null, string));
          }, 100);
        }, reject);
      })
    });
  };
}

export function setPassword(data) {
  return (dispatch) => {
    dispatch({
      type: USER_SET_PASSWORD,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.services.auth}/signups/${data.id}/claim`)
        .send(data)
        .then((res) => {
          resolve(res.body);
          setTimeout(() => {
            dispatch(pushState(null, '/start/tutorial'));
          }, 100);
        }, reject);
      })
    });
  };
}

export function logout(query){
  return (dispatch) => {
    storage.remove('user');
    dispatch({
      type: USER_LOGOUT
    });
    setTimeout(() => {
      dispatch(pushState(null, '/login', query));
    }, 30);
  };
}

export function refresh() {
  return (dispatch, state) => {
    //logged out
    if (!state().user.get('auth')){
      return false;
    }
    return dispatch({
      type: USER_REFRESH,
      payload: new Promise((resolve, reject) => {
        request
        .put(`${config.services.auth}/authenticate/refresh`)
        .set('Authorization', state().user.get('auth'))
        .timeout(7000)
        .then((res) => {
          resolve(res.body);
        }, (err) => {
          const redirect = state().router.location.pathname;
          let string = redirect ? '/login' : `/login?redirect=${redirect}`;
          storage.remove('user');
          dispatch(pushState(null, string));
          reject(err);
        });
      })
    });
  };
}

export const userApply = createAction(USER_APPLY);

export function edit(data) {
  return (dispatch, state) => {
    dispatch({
      type: USER_EDIT,
      payload: new Promise((resolve, reject) => {
        request
        .put(`${config.services.auth}/users/${data.id}`)
        .set('Authorization', state().user.get('auth'))
        .send(data)
        .then((res) => {
          resolve(res.body);
          //TODO fix this somehow
          setTimeout(() => {
            dispatch(pushState(null, '/profile'));
          }, 100);
        }, reject);
      })
    });
  };
}

export function getCustomer(){
  return (dispatch, state) => {
    dispatch({
      type: USER_GET_CUSTOMER,
      payload: new Promise((resolve, reject) => {
        return request
        .get(`${config.services.api}/customer`)
        .set('Authorization', state().user.get('auth'))
        .then((res) => {
          let body = _.get(res, 'body.body');
          if (body){
            try {
              body = JSON.parse(body);
              return resolve({customerId: body.customer.id});
            } catch (err){
              _.noop();
            }
          }
          return reject(new Error('Could not parse JSON.'));
        }, reject);
      })
    });
  };
}

export function getData(){
  return (dispatch, state) => {
    dispatch({
      type: USER_GET_DATA,
      payload: new Promise((resolve, reject) => {
        request
        .get(`${config.services.auth}/users/${state().user.get('id')}/data`)
        .set('Authorization', state().user.get('auth'))
        .then(res => resolve(res.body), reject);
      })
    });
  };
}

export function putData(key, data, reset){
  return (dispatch, state) => {
    dispatch({
      type: USER_PUT_DATA,
      payload: new Promise((resolve, reject) => {
        request
        .get(`${config.services.auth}/users/${state().user.get('id')}/data`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          let user = res.body;
          let history = user[key];
          let index;
          if (history && Array.isArray(history) && history.length){
            index = history.length - 1;
          } else {
            index = 0;
            user[key] = [];
          }
          let record = user[key][index];
          if (record && record.revision !== config.revision){
            index++;
          }
          user[key][index] = {
            revision: config.revision,
            data: data
          };
          if (reset){
            user[key] = false;
          }
          return request
          .put(`${config.services.auth}/users/${state().user.get('id')}/data`)
          .set('Authorization', state().user.get('auth'))
          .send(user)
          .then(res2 => resolve(res2.body), reject);
        }, reject);
      })
    });
  };
}

export function sendResetEmail(data) {
  return (dispatch) => {
    dispatch({
      type: USER_SEND_RESET_EMAIL,
      payload: new Promise((resolve, reject) => {
        request
        .post(`${config.services.auth}/authenticate/token`)
        .send(data)
        .then(res => resolve(res.body), reject);
      })
    });
  };
}

export function setLoginData(data){
  return (dispatch) => {
    dispatch({
      type: USER_SET_LOGIN_DATA,
      payload: data
    });
  };
}