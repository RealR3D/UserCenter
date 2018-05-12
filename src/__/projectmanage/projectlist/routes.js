export default {

  path: 'projectlist',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/projectmanage/projectlist/index').default);
        });
      }
    });
  },
  
}