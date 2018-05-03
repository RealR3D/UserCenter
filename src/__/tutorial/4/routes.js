export default {

  path: '4',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/tutorial/4/index').default);
        });
      }
    });
  },
  
}