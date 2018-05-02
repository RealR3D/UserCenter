export default {

  path: ':menuId',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/menu/__menuId/index').default);
        });
      }
    });
  },
  
}