export default {

  path: 'logs_login',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/security/logs_login/index').default);
        });
      }
    });
  },
  
}