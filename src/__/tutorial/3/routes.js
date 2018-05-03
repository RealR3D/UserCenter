export default {

  path: '3',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/tutorial/3/index').default);
        });
      }
    });
  },
  
}