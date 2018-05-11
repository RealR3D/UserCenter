export default {

    path: 'dronelist',
    
    getIndexRoute(location, cb) {
      cb(null, {
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('../../../__/dronemanage/dronelist/index').default);
          });
        }
      });
    },
    
  }