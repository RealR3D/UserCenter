export default {

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./layout.jsx').default);
    });
  },
  
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        // require('./vrplanner/routes').default,
        require('./findpwd/routes').default,
        require('./login/routes').default,
        require('./logout/routes').default,
        require('./reg/routes').default,
        require('./z404/routes').default,
        require('./__/routes').default
      ]);
    });
  },
  
}