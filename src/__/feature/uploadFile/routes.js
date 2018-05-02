export default {

  path: 'uploadFile',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/feature/uploadFile/index').default);
        });
      }
    });
  },
  
}