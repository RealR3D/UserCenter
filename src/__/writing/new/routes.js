export default {

  path: 'new',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/writing/new/index').default);
        });
      }
    });
  },
  
}