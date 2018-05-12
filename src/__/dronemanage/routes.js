export default {

  path: 'dronemanage',
  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../__/dronemanage/layout.jsx').default);
    });
  },
  
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./dronelist/routes').default,
        require('./droneinfo/routes').default,
        require('./createdrone/routes').default,
      ]);
    });
  },
  
}