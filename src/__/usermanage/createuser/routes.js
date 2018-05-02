export default {

    path: 'createuser',
    
    getIndexRoute(location, cb) {
      cb(null, {
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('../../../__/usermanage/createuser/index').default);
          });
        }
      });
    },
    
  }