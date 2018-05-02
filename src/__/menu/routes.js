export default {

  path: 'menu',
  
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../__/menu/layout.jsx').default);
    });
  },
  
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./__menuId/routes').default
      ]);
    });
  },
  
}