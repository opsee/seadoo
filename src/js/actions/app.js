import {createAction} from 'redux-actions';
import {
  APP_INITIALIZE,
  APP_SHUTDOWN,
  APP_OPEN_CONTEXT_MENU,
  APP_CLOSE_CONTEXT_MENU,
  APP_MODAL_MESSAGE_OPEN,
  APP_MODAL_MESSAGE_CLOSE,
  APP_SET_DROPDOWN_ID
} from './constants';

export function shutdown(){
  return (dispatch) => {
    dispatch({
      type: APP_SHUTDOWN
    });
  };
}

export function initialize(){
  return (dispatch) => {
    dispatch({
      type: APP_INITIALIZE
    });
  };
}

export const openContextMenu = createAction(APP_OPEN_CONTEXT_MENU);
export const closeContextMenu = createAction(APP_CLOSE_CONTEXT_MENU);
export const modalMessageOpen = createAction(APP_MODAL_MESSAGE_OPEN);
export const modalMessageClose = createAction(APP_MODAL_MESSAGE_CLOSE);
export const setDropdownId = createAction(APP_SET_DROPDOWN_ID);