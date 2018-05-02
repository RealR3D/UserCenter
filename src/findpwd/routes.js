export default {

  path: 'findpwd',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../findpwd/index').default);
        });
      }
    });
  },
  
}