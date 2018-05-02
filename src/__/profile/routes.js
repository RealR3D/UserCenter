export default {

  path: 'profile',
  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../__/profile/layout.jsx').default);
    });
  },
  
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./avatar/routes').default,
        require('./basic/routes').default,
        require('./detail/routes').default,
        require('./username/routes').default
      ]);
    });
  },
  
}