export default {

  path: 'edit',
  
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./__siteId__channelId__id/routes').default
      ]);
    });
  },
  
}