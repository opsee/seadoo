// import storage from '../modules/storage';
import _ from 'lodash';
import {handleActions} from 'redux-actions';
import {
  APP_INITIALIZE,
  APP_SHUTDOWN,
  APP_OPEN_CONTEXT_MENU,
  APP_CLOSE_CONTEXT_MENU,
  APP_MODAL_MESSAGE_OPEN,
  APP_MODAL_MESSAGE_CLOSE,
  APP_SET_DROPDOWN_ID
} from '../actions/constants';

const initial = {
  ready: false,
  openContextMenu: undefined,
  dropdownId: undefined,
  modalMessage: {
    color: undefined,
    html: undefined,
    show: false
  }
};

export default handleActions({
  '@@reduxReactRouter/routerDidChange': {
    next(state){
      return _.assign({}, state, {
        openContextMenu: undefined
      });
    }
  },
  [APP_INITIALIZE]: {
    next(state){
      return _.assign({}, state, {ready: true});
    }
  },
  [APP_SHUTDOWN]: {
    next(state){
      return state;
    }
  },
  [APP_OPEN_CONTEXT_MENU]: {
    next(state, action){
      return _.assign({}, state, {
        openContextMenu: action.payload
      });
    }
  },
  [APP_CLOSE_CONTEXT_MENU]: {
    next(state){
      return _.assign({}, state, {
        openContextMenu: undefined
      });
    }
  },
  [APP_MODAL_MESSAGE_OPEN]: {
    next(state, action){
      return _.assign({}, state, {
        modalMessage: _.assign({}, action.payload, {show: true})
      });
    }
  },
  [APP_MODAL_MESSAGE_CLOSE]: {
    next(state){
      const modalMessage = _.assign({}, state.modalMessage, {
        show: false
      });
      return _.assign({}, state, {modalMessage});
    }
  },
  [APP_SET_DROPDOWN_ID]: {
    next(state, action){
      return _.assign({}, state, {dropdownId: action.payload});
    }
  }
}, initial);