import _ from 'lodash';

const initial = require('../../../config/default').default;

if (process.env){
  let env = process.env.NODE_ENV || 'default';
  if (!env.match('default|development|production|local|debug')){
    console.error(`Attempted configuration file '${env}.js' is not allowed. Falling back to default.`);
    env = 'default';
  }
  const optional = require(`../../../config/${env}`).default || {};
  window.config = _.assign(initial, optional);
}

export default window.config || initial || {};