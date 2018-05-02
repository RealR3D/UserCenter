export default {

  path: 'writing',
  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../__/writing/layout.jsx').default);
    });
  },
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../__/writing/index').default);
        });
      }
    });
  },
  
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./edit/routes').default,
        require('./list/routes').default,
        require('./new/routes').default
      ]);
    });
  },
  
}