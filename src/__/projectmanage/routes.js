export default {

  path: 'projectmanage',
  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../__/projectmanage/layout.jsx').default);
    });
  },
  
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./projectlist/routes').default,
        require('./uploadfile/routes').default,
        require('./createproject/routes').default,
        require('./projectprofile/routes').default
      ]);
    });
  },
  
}