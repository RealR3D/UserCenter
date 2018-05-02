export default {

  path: 'profile',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/info/profile/index').default);
        });
      }
    });
  },
  
}