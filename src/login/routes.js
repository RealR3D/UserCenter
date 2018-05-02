export default {

  path: 'login',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../login/index').default);
        });
      }
    });
  },
  
}