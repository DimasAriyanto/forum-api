const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forum_jwt',
    },
  },
  {
    method: 'POST',
    path: '/threads',
    handler: handler.getThreadDetailHendler,
    options: {
      auth: 'forum_jwt',
    },
  },
]);

module.exports = routes;
