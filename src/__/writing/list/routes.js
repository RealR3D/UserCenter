export default {

  path: 'list',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/writing/list/index').default);
        });
      }
    });
  },
  
}