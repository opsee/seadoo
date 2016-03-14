import _ from 'lodash';
import {fromJS, List} from 'immutable';
import result from '../modules/result';
import {itemsFilter, yeller} from '../modules';
// import exampleGroupsElb from '../examples/groupsElb';
import {handleActions} from 'redux-actions';
import {InstanceEcc, InstanceRds, GroupSecurity, GroupElb} from '../modules/schemas';
import {
  ENV_GET_BASTIONS,
  GET_GROUP_SECURITY,
  GET_GROUPS_SECURITY,
  GET_GROUP_ELB,
  GET_GROUPS_ELB,
  GET_INSTANCE_ECC,
  GET_INSTANCES_ECC,
  GET_INSTANCE_RDS,
  GET_INSTANCES_RDS,
  ENV_SET_FILTERED,
  AWS_REBOOT_INSTANCES,
  AWS_START_INSTANCES,
  AWS_STOP_INSTANCES
} from '../actions/constants';

/* eslint-disable no-use-before-define */

const statics = {
  getGroupSecuritySuccess(state, data){
    const arr = state.groups.security;
    const single = statics.groupSecurityFromJS(state, data);
    const index = arr.findIndex(item => {
      return item.get('id') === single.get('id');
    });
    if (index > -1){
      return arr.update(index, () => single);
    }
    return arr.concat(new List([single]));
  },
  getGroupsSecuritySuccess(state, data){
    let newData = _.chain(data).map(d => {
      d.group.type = 'security';
      return d;
    }).sortBy(d => {
      return d.group.GroupName.toLowerCase();
    }).value();
    const changed = newData && newData.length ? fromJS(newData.map(g => {
      return statics.groupSecurityFromJS(state, g);
    })) : new List();
    return changed;
  },
  getGroupElbSuccess(state, data){
    const arr = state.groups.elb;
    const single = statics.groupElbFromJS(state, data);
    const index = arr.findIndex(item => {
      return item.get('id') === single.get('id');
    });
    if (index > -1){
      return arr.update(index, () => single);
    }
    return arr.concat(new List([single]));
  },
  getGroupsElbSuccess(state, data){
    let newData = _.chain(data)
    .sortBy(d => {
      return d.group.LoadBalancerName.toLowerCase();
    }).value();
    const changed = newData && newData.length ? fromJS(newData.map(g => {
      return statics.groupElbFromJS(state, g);
    })) : new List();
    return changed;
  },
  groupElbFromJS(state, data){
    let newData = data.group || data;
    newData.instance_count = data.instance_count;
    if (Array.isArray(newData.Instances)){
      newData.instances = new List(_.map(newData.Instances, 'InstanceId'));
    } else {
      newData.instances = new List();
    }
    newData.name = newData.LoadBalancerName;
    newData.id = newData.LoadBalancerName;
    _.assign(newData, result.getFormattedData(data));
    newData.checks = new List(newData.checks);
    if (newData.checks.size && !newData.results.size){
      newData.state = 'initializing';
    }
    return new GroupElb(newData);
  },
  groupSecurityFromJS(state, data){
    let newData = data.group || data;
    newData.instance_count = data.instance_count;
    newData.meta = fromJS(newData.meta);
    newData.id = newData.GroupId;
    newData.name = newData.GroupName;
    _.assign(newData, result.getFormattedData(data));
    newData.checks = new List(newData.checks);
    if (newData.checks.size && !newData.results.size){
      newData.state = 'initializing';
    }
    return new GroupSecurity(newData);
  },
  getInstanceEccSuccess(state, data){
    const arr = state.instances.ecc;
    const single = statics.instanceEccFromJS(data);
    const index = arr.findIndex(item => {
      return item.get('id') === single.get('id');
    });
    if (index > -1){
      return arr.update(index, () => single);
    }
    return arr.concat(new List([single]));
  },
  getInstancesEccSuccess(state, data){
    let newData = _.chain(data)
    .map(statics.instanceEccFromJS)
    .sortBy(i => {
      return i.name.toLowerCase();
    }).value();
    return newData && newData.length ? fromJS(newData) : List();
  },
  getInstanceRdsSuccess(state, data){
    const arr = state.instances.rds;
    const single = statics.instanceRdsFromJS(data);
    const index = arr.findIndex(item => {
      return item.get('id') === single.get('id');
    });
    if (index > -1){
      return arr.update(index, () => single);
    }
    return arr.concat(new List([single]));
  },
  getInstancesRdsSuccess(state, data){
    let newData = _.chain(data)
    .map(statics.instanceRdsFromJS)
    .sortBy(i => {
      return i.name.toLowerCase();
    }).value();
    return newData && newData.length ? fromJS(newData) : List();
  },
  getCreatedTime(time){
    let launchTime;
    const parsed = Date.parse(time);
    if (typeof parsed === 'number' && !_.isNaN(parsed) && parsed > 0){
      launchTime = parsed;
    }
    return launchTime;
  },
  instanceRdsFromJS(raw){
    let data = raw.instance;
    let newData = data.instance ? _.cloneDeep(data.instance) : _.cloneDeep(data);
    if (!newData.results){
      newData.results = raw.results || data.results;
    }
    newData.id = newData.name = newData.DBInstanceIdentifier;
    if (newData.DBName !== newData.id){
      newData.name = `${newData.DBName} - ${newData.id}`;
    }
    newData.LaunchTime = statics.getCreatedTime(newData.InstanceCreateTime);
    newData.type = 'RDS';
    newData.VpcSecurityGroups = new List(newData.VpcSecurityGroups.map(g => fromJS(g)));
    _.assign(newData, result.getFormattedData(newData));
    if (newData.checks && newData.checks.size && !newData.results.size){
      newData.state = 'initializing';
    }
    newData.meta = fromJS(newData.meta);
    return new InstanceRds(newData);
  },
  instanceEccFromJS(raw){
    let data = raw.instance;
    let newData = data.instance ? _.cloneDeep(data.instance) : _.cloneDeep(data);
    if (!newData.results){
      newData.results = raw.results || data.results;
    }
    newData.id = newData.InstanceId;
    let name = newData.id;
    if (newData.Tags && newData.Tags.length){
      name = _.chain(newData.Tags).find({Key: 'Name'}).get('Value').value() || name;
    }
    if (Array.isArray(newData.SecurityGroups)){
      newData.SecurityGroups = new List(newData.SecurityGroups.map(g => fromJS(g)));
    } else {
      newData.SecurityGroups = new List();
    }
    newData.Placement = fromJS(newData.Placement);
    newData.name = name;
    newData.LaunchTime = statics.getCreatedTime(newData.LaunchTime);
    newData.type = 'EC2';
    _.assign(newData, result.getFormattedData(newData));
    if (newData.checks && newData.checks.size && !newData.results.size){
      newData.state = 'initializing';
    }
    //TODO - make sure status starts working when coming from api, have to code it like meta below
    newData.meta = fromJS(newData.meta);
    return new InstanceEcc(newData);
  },
  getNewFiltered(data = new List(), state, action = {payload: {search: ''}}, type = ''){
    const arr = type.split('.');
    const filteredData = itemsFilter(data, action.payload.search, type);
    //this looks nasty but all we are doing is creating a new filtered obj with fresh data
    return _.assign({}, state.filtered, {[arr[0]]: _.assign({}, state.filtered[arr[0]], {[arr[1]]: filteredData})});
  }
};

const initial = {
  groups: {
    security: new List(),
    rds: new List(),
    elb: new List()
  },
  instances: {
    ecc: new List(),
    rds: new List()
  },
  filtered: {
    groups: {
      security: new List(),
      rds: new List(),
      elb: new List()
    },
    instances: {
      ecc: new List(),
      rds: new List()
    }
  },
  bastions: [],
  awsActionHistory: []
};

export default handleActions({
  [GET_GROUP_SECURITY]: {
    next(state, action){
      const security = statics.getGroupSecuritySuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(security, state, action, 'groups.security');
      const groups = _.assign({}, state.groups, {security});
      return _.assign({}, state, {groups, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_GROUPS_SECURITY]: {
    next(state, action){
      const security = statics.getGroupsSecuritySuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(security, state, action, 'groups.security');
      const groups = _.assign({}, state.groups, {security});
      return _.assign({}, state, {groups, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_GROUP_ELB]: {
    next(state, action){
      const elb = statics.getGroupElbSuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(elb, state, action, 'groups.elb');
      const groups = _.assign({}, state.groups, {elb});
      return _.assign({}, state, {groups, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_GROUPS_ELB]: {
    next(state, action){
      const elb = statics.getGroupsElbSuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(elb, state, action, 'groups.elb');
      const groups = _.assign({}, state.groups, {elb});
      return _.assign({}, state, {groups, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_INSTANCE_ECC]: {
    next(state, action){
      const ecc = statics.getInstanceEccSuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(ecc, state, action, 'instances.ecc');
      const instances = _.assign({}, state.instances, {ecc});
      return _.assign({}, state, {instances, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_INSTANCES_ECC]: {
    next(state, action){
      const ecc = statics.getInstancesEccSuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(ecc, state, action, 'instances.ecc');
      const instances = _.assign({}, state.instances, {ecc});
      return _.assign({}, state, {instances, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_INSTANCE_RDS]: {
    next(state, action){
      const rds = statics.getInstanceRdsSuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(rds, state, action, 'instances.rds');
      const instances = _.assign({}, state.instances, {rds});
      return _.assign({}, state, {instances, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_INSTANCES_RDS]: {
    next(state, action){
      const rds = statics.getInstancesRdsSuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(rds, state, action, 'instances.rds');
      const instances = _.assign({}, state.instances, {rds});
      return _.assign({}, state, {instances, filtered});
    },
    throw: yeller.reportAction
  },
  [ENV_GET_BASTIONS]: {
    next(state, action){
      return _.assign({}, state, {bastions: action.payload});
    },
    throw: yeller.reportAction
  },
  [ENV_SET_FILTERED]: {
    next(state, action = {payload: {string: '', tokens: []}}){
      const {groups, instances} = state;
      const filtered = {
        groups: {
          security: itemsFilter(groups.security, action.payload, 'groups.security'),
          elb: itemsFilter(groups.elb, action.payload, 'groups.elb')
        },
        instances: {
          ecc: itemsFilter(instances.ecc, action.payload, 'instances.ecc'),
          rds: itemsFilter(instances.rds, action.payload, 'instances.rds')
        }
      };
      return _.assign({}, state, {filtered});
    }
  },
  [AWS_START_INSTANCES]: {
    next(state, action){
      const awsActionHistory = state.awsActionHistory.concat([
        {
          action: 'start',
          ids: action.payload || [],
          date: new Date()
        }
      ]);
      return _.assign({}, state, {awsActionHistory});
    },
    throw: yeller.reportAction
  },
  [AWS_STOP_INSTANCES]: {
    next(state, action){
      const awsActionHistory = state.awsActionHistory.concat([
        {
          action: 'stop',
          ids: action.payload || [],
          date: new Date()
        }
      ]);
      return _.assign({}, state, {awsActionHistory});
    },
    throw: yeller.reportAction
  },
  [AWS_REBOOT_INSTANCES]: {
    next(state, action){
      const awsActionHistory = state.awsActionHistory.concat([
        {
          action: 'reboot',
          ids: action.payload || [],
          date: new Date()
        }
      ]);
      return _.assign({}, state, {awsActionHistory});
    },
    throw: yeller.reportAction
  }
}, initial);