export default {

  path: 'usermanage',
  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../__/usermanage/layout.jsx').default);
    });
  },
  
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./userlist/routes').default,
        require('./userinfo/routes').default,
        require('./createuser/routes').default,
      ]);
    });
  },
  
}