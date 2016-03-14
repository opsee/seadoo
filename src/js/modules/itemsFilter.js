import {List} from 'immutable';
import fuzzy from 'fuzzy';
import _ from 'lodash';

export default function(items = new List(), search = {string: '', tokens: []}){
  let newItems = items;
  const {tokens} = search;
  if (tokens.length){
    //do fuzzy searching first
    const stringQuery = _.chain(tokens).reject('tag').map('term').join(' ').value();
    const results = newItems.toJS().map(item => {
      const fields = [item.name, item.id];
      const hits = fuzzy.filter(stringQuery, fields);
      return {
        score: _.chain(hits).map('score').reduce((total, n) => total + n).value() || 0,
        id: item.id
      };
    });
    newItems = newItems.sortBy((item, index) => {
      return -1 * results[index].score;
    });
    if (stringQuery){
      newItems = newItems.filter(item => {
        return _.chain(results).find({id: item.get('id')}).get('score').value();
      });
    }
    //now let's run through the tags
    if (_.filter(tokens, 'tag').length){
      newItems = newItems.filter(item => {
        if (item.get){
          const boolArray = _.filter(tokens, 'tag').map(token => {
            let isMatching;
            let {tag = '', term} = token;
            switch (term){
            case 'true':
              term = true;
              break;
            case 'false':
              term = false;
              break;
            default:
              break;
            }
            if (tag.match('passing|failing')){
              isMatching = item.get('state') === tag;
            }
            if (tag === 'state' && term === 'unmonitored'){
              term = 'running';
            }
            if (tag === 'health'){
              term = parseInt(term, 10);
            }
            if (item.get(tag) === term){
              isMatching = true;
            }
            return isMatching;
          });
          return _.some(boolArray);
        }
        return false;
      });
    }
  }
  return newItems;
}