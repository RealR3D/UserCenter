export default {

  path: 'logout',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../logout/index').default);
        });
      }
    });
  },
  
}