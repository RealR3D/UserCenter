export default {

    path: 'droneinfo',
    
    getIndexRoute(location, cb) {
      cb(null, {
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('../../../__/dronemanage/droneinfo/index').default);
          });
        }
      });
    },
    
  }