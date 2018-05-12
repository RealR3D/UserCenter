export default {

  path: 'createproject',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/projectmanage/createproject/index').default);
        });
      }
    });
  },
  
}