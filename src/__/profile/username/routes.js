export default {

  path: 'username',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/profile/username/index').default);
        });
      }
    });
  },
  
}