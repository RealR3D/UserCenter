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
        // require('./menu/routes').default,
        // require('./profile/routes').default,
        // require('./security/routes').default,
        // require('./writing/routes').default,
        require('./info/routes').default,
        require('./service/routes').default,
        require('./feature/routes').default,
        require('./usermanage/routes').default,
        require('./tutorial/routes').default
      ]);
    });
  },
  
}