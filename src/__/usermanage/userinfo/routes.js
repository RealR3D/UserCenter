export default {

    path: 'userinfo',
    
    getIndexRoute(location, cb) {
      cb(null, {
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('../../../__/usermanage/userinfo/index').default);
          });
        }
      });
    },
    
  }