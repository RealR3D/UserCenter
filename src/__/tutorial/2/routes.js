export default {

  path: '2',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/tutorial/2/index').default);
        });
      }
    });
  },
  
}