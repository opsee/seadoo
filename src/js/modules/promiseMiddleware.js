import {isFSA} from 'flux-standard-action';
import _ from 'lodash';

function isPromise(val) {
  return val && typeof val.then === 'function';
}

export function promiseMiddleware({ dispatch }) {
  return next => action => {
    if (!isFSA(action)) {
      return isPromise(action)
        ? action.then(dispatch)
        : next(action);
    }
    if (isPromise(action.payload)){
      const aType = `${action.type}_ASYNC`;
      const id = _.uniqueId();
      dispatch({
        type: aType,
        payload: {
          status: 'pending',
          time: new Date(),
          id
        }
      });
      return action.payload.then(
        result => {
          dispatch({
            type: aType,
            payload: {
              time: new Date(),
              status: 'success',
              id
            }
          });
          return dispatch(_.assign({}, action, {payload: result}));
        },
        error => {
          if (process.env.NODE_ENV !== 'production'){
            if (!error instanceof Error){
              throw Error(`Error object from ${action.type} is not a true error.`);
            }
          }
          dispatch({
            type: aType,
            payload: {
              time: new Date(),
              status: error,
              id
            }
          });
          return dispatch(_.assign({}, action, {payload: error, error: true }));
        }
      );
    }
    return next(action);
  };
}