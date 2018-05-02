export default {

  path: 'info',
  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../__/info/layout.jsx').default);
    });
  },
  
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./profile/routes').default,
        require('./password/routes').default
      ]);
    });
  },
  
}