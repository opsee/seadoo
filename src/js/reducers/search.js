import _ from 'lodash';
import {handleActions} from 'redux-actions';
import {parse} from 'query-string';
import tokenizer from 'search-text-tokenizer';

import {
  SEARCH_SET_STRING
} from '../actions/constants';

const initialString = parse(window.location.search).s || '';
const intialTokens = tokenizer(initialString);

const initial = {
  string: initialString,
  tokens: intialTokens
};

export default handleActions({
  [SEARCH_SET_STRING]: {
    next(state, action){
      const string = action.payload;
      const tokens = tokenizer(string);
      return _.assign({}, state, {string, tokens});
    }
  }
}, initial);