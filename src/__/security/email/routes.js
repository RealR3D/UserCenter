export default {

  path: 'email',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/security/email/index').default);
        });
      }
    });
  },
  
}