export default {

  path: 'detail',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/profile/detail/index').default);
        });
      }
    });
  },
  
}