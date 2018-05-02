export default {

  path: 'avatar',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/profile/avatar/index').default);
        });
      }
    });
  },
  
}