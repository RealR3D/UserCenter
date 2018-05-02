export default {

  path: 'z404',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../z404/index').default);
        });
      }
    });
  },
  
}