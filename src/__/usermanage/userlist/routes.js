export default {

    path: 'userlist',
    
    getIndexRoute(location, cb) {
      cb(null, {
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('../../../__/usermanage/userlist/index').default);
          });
        }
      });
    },
    
  }