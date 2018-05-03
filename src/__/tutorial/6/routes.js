export default {

  path: '6',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/tutorial/6/index').default);
        });
      }
    });
  },
  
}