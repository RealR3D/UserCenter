export default {

  path: 'feature',
  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../__/feature/layout.jsx').default);
    });
  },
  
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./myProject/routes').default,
        require('./uploadFile/routes').default,
        require('./createProject/routes').default,
        require('./projectProfile/routes').default
      ]);
    });
  },
  
}