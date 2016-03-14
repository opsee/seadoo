import storage from '../modules/storage';
import _ from 'lodash';
import {handleActions} from 'redux-actions';
import moment from 'moment';
import config from '../modules/config';
import {User} from '../modules/schemas';
import {yeller} from '../modules';
import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_REFRESH,
  USER_EDIT,
  USER_SET_PASSWORD,
  USER_GET_CUSTOMER,
  USER_GET_DATA,
  USER_PUT_DATA,
  USER_APPLY,
  USER_SET_LOGIN_DATA
} from '../actions/constants';

function getAuth(data){
  const date = data.loginDate;
  const momentDate = moment(date);
  const diff = moment().diff(momentDate, 'm');
  // 720 minutes == 12 hours
  let minutes = 720;
  // 15 minutes for ghosting
  if (data.admin_id > 0){
    minutes = 15;
  }
  const valid = !!(typeof diff === 'number' && diff < minutes && diff > -1);
  let auth;
  if (date && valid && data.token){
    auth = `Bearer ${data.token}`;
  }
  return auth;
}

let initial = new User();
const localUser = storage.get('user');
if (localUser && getAuth(localUser)){
  initial = new User(localUser);
}

function setUser(state, action){
  let obj = _.assign({},
    action.payload.user,
    {
      token: action.payload.token || state.token,
      loginDate: action.payload.loginDate || new Date(),
      intercom_hmac: action.payload.intercom_hmac || state.intercom_hmac
    }
  );
  obj.ghosting = obj.admin_id > 0 || config.ghosting;
  const auth = getAuth(obj);
  if (auth){
    obj = _.assign({}, obj, {auth});
    storage.set('user', obj);
    return new User(obj);
  }
  return state;
}

export default handleActions({
  [USER_LOGIN]: {
    next: setUser
  },
  [USER_EDIT]: {
    next: setUser,
    throw: yeller.reportAction
  },
  [USER_SET_PASSWORD]: {
    next: setUser
  },
  [USER_LOGOUT]: {
    next(){
      return new User();
    }
  },
  [USER_REFRESH]: {
    next(state, action){
      const data = _.assign({}, action.payload, {loginDate: new Date()});
      return setUser(state, {payload: data});
    },
    throw(state, action){
      yeller.reportAction(state, action);
      return new User();
    }
  },
  [USER_GET_CUSTOMER]: {
    next(state, action){
      return new User(_.assign({}, state.toJS(), action.payload));
    },
    throw: yeller.reportAction
  },
  [USER_GET_DATA]: {
    next(state, action){
      return new User(_.assign({}, state.toJS(), {data: action.payload}));
    },
    throw: yeller.reportAction
  },
  [USER_PUT_DATA]: {
    next(state, action){
      return new User(_.assign({}, state.toJS(), {data: action.payload}));
    },
    throw: yeller.reportAction
  },
  [USER_APPLY]: {
    next(state, action){
      return setUser(state, action);
    }
  },
  [USER_SET_LOGIN_DATA]: {
    next(state, action){
      return new User(_.assign({}, state.toJS(), {loginData: action.payload}));
    }
  }
}, initial);