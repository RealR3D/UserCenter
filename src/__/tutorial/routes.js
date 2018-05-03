export default {

  path: 'tutorial',
  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../__/tutorial/layout.jsx').default);
    });
  },
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../__/tutorial/index').default);
        });
      }
    });
  },

  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./1/routes').default,
        require('./2/routes').default,
        require('./3/routes').default,
        require('./4/routes').default,
        require('./5/routes').default,
        require('./6/routes').default,
        require('./7/routes').default
      ]);
    });
  },
  
}