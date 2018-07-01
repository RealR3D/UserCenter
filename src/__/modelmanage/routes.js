export default {

    path: 'modelmanage',
    
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../../__/modelmanage/layout.jsx').default);
      });
    },
    
    getIndexRoute(location, cb) {
      cb(null, {
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('../../__/modelmanage/index.jsx').default);
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