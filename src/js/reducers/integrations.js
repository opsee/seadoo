import _ from 'lodash';
import {List} from 'immutable';
import {handleActions} from 'redux-actions';

import {yeller} from '../modules';
import {
  INTEGRATIONS_SLACK_ACCESS,
  INTEGRATIONS_SLACK_CHANNELS,
  INTEGRATIONS_SLACK_INFO,
  INTEGRATIONS_SLACK_TEST,
  INTEGRATIONS_EMAIL_TEST
} from '../actions/constants';

const initial = {
  slackChannels: new List(),
  slackInfo: {},
  tests: []
};

export default handleActions({
  [INTEGRATIONS_SLACK_ACCESS]: {
    next(state){
      return state;
    },
    throw: yeller.reportAction
  },
  [INTEGRATIONS_SLACK_INFO]: {
    next(state, action){
      const slackInfo = action.payload;
      return _.assign({}, state, {slackInfo});
    }
  },
  [INTEGRATIONS_SLACK_CHANNELS]: {
    next(state, action){
      const slackChannels = new List(action.payload);
      return _.assign({}, state, {slackChannels});
    }
  },
  [INTEGRATIONS_EMAIL_TEST]: {
    next(state, action){
      const obj = _.assign({}, action.payload, {
        success: true
      });
      return _.assign({}, state, {
        tests: state.tests.concat([obj])
      });
    },
    throw(state, action){
      return _.assign({}, state, {
        tests: state.tests.concat([action.payload])
      });
    }
  },
  [INTEGRATIONS_SLACK_TEST]: {
    next(state, action){
      const obj = _.assign({}, action.payload, {
        success: true
      });
      return _.assign({}, state, {
        tests: state.tests.concat([obj])
      });
    },
    throw(state, action){
      return _.assign({}, state, {
        tests: state.tests.concat([action.payload])
      });
    }
  }
}, initial);