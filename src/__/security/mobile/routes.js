export default {

  path: 'mobile',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/security/mobile/index').default);
        });
      }
    });
  },
  
}