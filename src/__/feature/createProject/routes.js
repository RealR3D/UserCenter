export default {

  path: 'createProject',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/feature/createProject/index').default);
        });
      }
    });
  },
  
}