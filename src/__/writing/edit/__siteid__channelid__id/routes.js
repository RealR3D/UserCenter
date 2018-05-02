export default {

  path: ':siteId/:channelId/:id',
  
  getIndexRoute(location, cb) {
    cb(null, {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../../../../__/writing/edit/__siteId__channelId__id/index').default);
        });
      }
    });
  },
  
}