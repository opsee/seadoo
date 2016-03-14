import _ from 'lodash';
import * as constants from '../actions/constants';

export default function asyncActions(state, action = {type: null}) {
  let initial = {};
  _.keys(constants).forEach(c => {
    const name = _.camelCase(c.replace(/_ASYNC$/, ''));
    initial[name] = {
      status: null,
      history: []
    };
  });
  if (typeof state  === 'undefined'){
    return initial;
  }
  if (typeof action.type === 'string' && action.type.match('_ASYNC$')){
    const stripped = _.camelCase(action.type.replace(/_ASYNC$/, ''));
    const history = (state[stripped] && state[stripped].history) || [];
    let obj = {};
    if (action.payload.status !== 'pending'){
      //this allows the most recent pending request to trump all previous if the service is slow for some reason
      if (state[stripped] && state[stripped].id === action.payload.id){
        obj[stripped] = _.assign({}, action.payload, {
          history: history.concat([action.payload])
        });
      }
    } else {
      obj[stripped] = _.assign({}, action.payload, {
        history
      });
    }
    return _.assign({}, state, obj);
  }
  return state;
}