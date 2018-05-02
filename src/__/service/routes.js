export default {

  path: 'service',
  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../__/service/layout.jsx').default);
    });
  },
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../__/service/index').default);
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