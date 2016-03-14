import _ from 'lodash';

const {Yeller} = window;

const yeller = {
  report(...args){
    if (typeof Yeller === 'function'){
      return Yeller.report(...args);
    }
    return null;
  },
  reportAction(state, action = {payload: {}}){
    const payload = action.payload || {};
    yeller.report(new Error(payload.message), {
      location: action.type,
      url: payload.url,
      custom_data: {
        method: payload.method
      }
    });
    return state;
  },
  configure(redux){
    if (typeof Yeller === 'function'){
      Yeller.configure({
        token: 'yk_w_f5f4b9abeaad0266f6b0de9ca8cc756b65dc3e86312566d7398caf0fde0f577a',
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        transform(err){
          const data = err['custom-data'] || {};
          return _.assign({}, err, {
            'custom-data': _.assign({}, data, {
              userId: redux.user.get('id')
            })
          });
        }
      });
    }
  }
};

export default yeller;