export default {

  path: 'basic',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/profile/basic/index').default);
        });
      }
    });
  },
  
}