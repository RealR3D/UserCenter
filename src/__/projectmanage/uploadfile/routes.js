export default {

  path: 'uploadfile',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../__/projectmanage/uploadfile/index').default);
        });
      }
    });
  },
  
}