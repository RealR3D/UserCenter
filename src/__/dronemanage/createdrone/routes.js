export default {

    path: 'createdrone',
    
    getIndexRoute(location, cb) {
      cb(null, {
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('../../../__/dronemanage/createdrone/index').default);
          });
        }
      });
    },
    
  }