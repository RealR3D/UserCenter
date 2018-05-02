export default {

  path: 'security',
  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../__/security/layout.jsx').default);
    });
  },
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../__/security/index').default);
        });
      }
    });
  },
  
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./email/routes').default,
        require('./logs_login/routes').default,
        require('./logs_sensitive/routes').default,
        require('./mobile/routes').default,
        require('./password/routes').default
      ]);
    });
  },
  
}