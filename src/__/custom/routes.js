export default {

    path: 'custom',
    
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../../__/custom/layout.jsx').default);
      });
    },
    
    getIndexRoute(location, cb) {
      cb(null, {
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('../../__/custom/index').default);
          });
        }
      });
    },
  
    getChildRoutes(location, cb) {
      require.ensure([], (require) => {
        cb(null, [
        ]);
      });
    },
    
  }