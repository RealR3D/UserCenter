export default {

  path: 'myProject',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/feature/myProject/index').default);
        });
      }
    });
  },
  
}