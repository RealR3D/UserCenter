export default {

  path: 'projectprofile',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/projectmanage/projectprofile/index').default);
        });
      }
    });
  },
  
}