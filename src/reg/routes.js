export default {

  path: 'reg',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../reg/index').default);
        });
      }
    });
  },
  
}