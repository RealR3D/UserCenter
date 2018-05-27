export default {

  path: '/',
  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../__/layout.jsx').default);
    });
  },
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../__/index').default);
        });
      }
    });
  },
  
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./info/routes').default,
        // require('./service/routes').default,
        require('./custom/routes').default,
        require('./projectmanage/routes').default,
        require('./usermanage/routes').default,
        require('./dronemanage/routes').default,
        require('./tutorial/routes').default
      ]);
    });
  },
  
}