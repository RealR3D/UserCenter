export default {

  path: 'password',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/security/password/index').default);
        });
      }
    });
  },
  
}