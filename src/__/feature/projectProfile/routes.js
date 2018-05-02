export default {

  path: 'projectProfile',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/feature/projectProfile/index').default);
        });
      }
    });
  },
  
}