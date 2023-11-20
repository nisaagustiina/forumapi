const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.addThreadHandler,
    options: {
      auth: 'forum_api_jwt_nisa',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.detailThreadByIdHandler,
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.addCommentHandler,
    options: {
      auth: 'forum_api_jwt_nisa',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentHandler,
    options: {
      auth: 'forum_api_jwt_nisa',
    },
  },
]);

module.exports = routes;
