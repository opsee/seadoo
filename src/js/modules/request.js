import superagentPromise from 'superagent-promise';
import superagent from 'superagent';
export default superagentPromise(superagent, Promise);