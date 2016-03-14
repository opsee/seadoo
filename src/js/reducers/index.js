import {combineReducers} from 'redux';
import {routerStateReducer as router} from 'redux-router';
import admin from './admin';
import app from './app';
import asyncActions from './asyncActions';
import search from './search';
import user from './user';

export default combineReducers({
  admin,
  app,
  asyncActions,
  router,
  search,
  user
});