import _ from 'lodash';
import {handleActions} from 'redux-actions';
import config from '../modules/config';
import {yeller} from '../modules';
import {plain as seed} from 'seedling';
import {
  ONBOARD_SET_REGION,
  ONBOARD_SET_CREDENTIALS,
  ONBOARD_VPC_SCAN,
  ONBOARD_VPC_SELECT,
  ONBOARD_SET_INSTALL_DATA,
  ONBOARD_SUBNET_SELECT,
  ONBOARD_INSTALL
} from '../actions/constants';

const initial = {
  'access_key': config.access_key,
  'secret_key': config.secret_key,
  region: config.region,
  regionsWithVpcs: [],
  vpcsForSelection: [],
  subnetsForSelection: [],
  bastionLaunching: undefined,
  installData: undefined,
  installing: false
};

function getFinalInstallData(state){
  const starter = {
    instance_size: 't2.micro'
  };
  const regions = _.chain(state.regionsWithVpcs).filter(region => {
    return _.find(region.subnets, v => v.selected);
  }).map(region => {
    return _.chain(region).pick(['region', 'subnets']).mapValues((value, key) => {
      if (key === 'subnets'){
        return _.chain(value).filter('selected').map(selected => {
          return _.chain(selected).pick(['subnet_id', 'vpc_id', 'routing']).mapKeys((childValue, childKey) => {
            switch (childKey){
            case 'routing':
              return 'subnet_routing';
            case 'vpc_id':
              return 'id';
            default:
              return childKey;
            }
          }).value();
        }).value();
      }
      return value;
    }).mapKeys((value, key) => {
      return key === 'subnets' ? 'vpcs' : key;
    }).value();
  }).value();
  return _.assign({}, starter, _.pick(state, ['access_key', 'secret_key']), {regions});
}

function generateSubnetsForSelection(regions){
  return _.chain(regions).map(region => {
    return _.chain(region.subnets).map(subnet => {
      let subnetName = subnet.subnet_id;
      if (subnet.tags.length){
        subnetName = _.chain(subnet.tags).find({key: 'Name'}).get('value').value() || subnetName;
      }
      const nameString = subnetName !== subnet.subnet_id ? `${subnetName}&nbsp;(${subnet.subnet_id})` : subnet.subnet_id;
      return [subnet.subnet_id, `
      <strong>${subnet.availability_zone}</strong>&nbsp;|&nbsp;${nameString}<br/>
      <span style="color:${seed.color.text2}">${subnet.instance_count} Instances (${subnet.routing})</span>
      `];
    }).value();
  }).flatten().value();
}

export default handleActions({
  [ONBOARD_SET_REGION]: {
    next(state, action){
      return _.assign({}, state, action.payload);
    }
  },
  [ONBOARD_SET_CREDENTIALS]: {
    next(state, action){
      return _.assign({}, state, action.payload);
    }
  },
  [ONBOARD_VPC_SCAN]: {
    next(state, action){
      const regionsWithVpcs = action.payload;

      const vpcsForSelection = _.chain(regionsWithVpcs).map(region => {
        return _.chain(region.vpcs).map(vpc => {
          let vpcName = vpc.vpc_id;
          if (vpc.tags.length){
            vpcName = _.chain(vpc.tags).find({key: 'Name'}).get('value').value() || vpcName;
          }
          const identifier = vpcName === vpc.vpc_id ? `<strong>${vpcName}</strong>` : `<strong>${vpcName}</strong> - ${vpc.vpc_id}`;
          return [vpc.vpc_id, `
          ${identifier} (${vpc.instance_count || 0} Instances)
          `];
        }).value();
      }).flatten().value();
      return _.assign({}, state, {regionsWithVpcs, vpcsForSelection});
    },
    throw: yeller.reportAction
  },
  [ONBOARD_VPC_SELECT]: {
    next(state, action){
      const regions = _.cloneDeep(state.regionsWithVpcs);
      const regionsWithVpcs = regions.map(parent => {
        const children = parent.vpcs.map(child => {
          return _.assign({}, child, {selected: child.vpc_id === action.payload});
        });
        return _.assign({}, parent, {vpcs: children});
      });
      const subnetsForSelection = generateSubnetsForSelection(regionsWithVpcs);
      return _.assign({}, state, {regionsWithVpcs, subnetsForSelection});
    }
  },
  [ONBOARD_SUBNET_SELECT]: {
    next(state, action){
      const regions = _.cloneDeep(state.regionsWithVpcs);
      const regionsWithVpcs = regions.map(parent => {
        const children = parent.subnets.map(child => {
          return _.assign({}, child, {selected: child.subnet_id === action.payload});
        });
        return _.assign({}, parent, {subnets: children});
      });
      return _.assign({}, state, {regionsWithVpcs});
    }
  },
  [ONBOARD_SET_INSTALL_DATA]: {
    next(state){
      const installData = getFinalInstallData(state);
      return _.assign({}, state, {installData});
    }
  },
  [ONBOARD_INSTALL]: {
    next(state){
      return _.assign({}, state, {installing: true});
    }
  }
}, initial);