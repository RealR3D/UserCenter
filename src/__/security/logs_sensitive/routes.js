export default {

  path: 'logs_sensitive',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/security/logs_sensitive/index').default);
        });
      }
    });
  },
  
}