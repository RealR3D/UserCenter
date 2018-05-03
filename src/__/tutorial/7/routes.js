export default {

  path: '7',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/tutorial/7/index').default);
        });
      }
    });
  },
  
}