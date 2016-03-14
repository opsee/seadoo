import {List, Record} from 'immutable';
import _ from 'lodash';
import moment from 'moment';

const OuterResponse = Record({
  check_id: undefined,
  passing: undefined,
  response: undefined,
  target: undefined,
  error: undefined
});

const InnerResponse = Record({
  type_url: undefined,
  value: Record({
    body: undefined,
    code: undefined,
    headers: List(),
    metrics: List()
  })
});

const Result = Record({
  check_id: undefined,
  host: undefined,
  passing: undefined,
  responses: List(),
  time: undefined
});

function fromJS(data){
  let newData = {};
  let results = _.cloneDeep(data.results);
  if (results && results.length){
    if (data.instance){
      results = _.filter(results, 'response');
    }
    let newResults = results.map(result => {
      // old, crap?
      // let responses = result.responses || result.response;
      // use just 'result' for instances while bartnet is screwy
      let responses = result.responses || result;
      responses = Array.isArray(responses) ? responses : [responses];
      responses = _.compact(responses);
      if (responses && responses.length){
        let resultData = _.cloneDeep(result);
        resultData.responses = new List(responses.map(r => {
          let d = _.cloneDeep(r);
          d.response = new InnerResponse(r.response);
          return new OuterResponse(d);
        }));
        return new Result(resultData);
      }
      return new Result();
    });
    newResults = _.compact(newResults);
    if (newResults && newResults.length){
      newData.results = new List(newResults);
    }
  }
  return newData.results;
}

export default {
  getFormattedData(data, useTestsInsteadOfChecks){
    let obj = {
      passing: undefined,
      total: undefined,
      health: undefined,
      results: fromJS(data) || new List()
    };
    if (obj.results && obj.results.size && obj.results.get(0)){
      //this works for groups
      let boolArray = _.chain(obj.results.toJS()).map('passing').value();
      if (useTestsInsteadOfChecks){
        boolArray = _.chain(obj.results.toJS()).map('responses').flatten().map('passing').value();
      }
      const passing = _.compact(boolArray);
      obj.passing = passing.length;
      obj.total = boolArray.length;
      obj.health = Math.floor((passing.length / boolArray.length) * 100);
      obj.state = obj.health === 100 ? 'passing' : 'failing';
      const d = moment.unix(obj.results.toJS()[0].time).toDate();
      if (_.isDate(d)){
        obj.lastChecked = d;
      }
    }
    return obj;
  }
};