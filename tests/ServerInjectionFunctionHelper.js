const ServerInjectionFunctionHelper = {
  async injection(server, options) {
    return server.inject(options);
  },

  addUserOpotion(payload) {
    return {
      method: 'POST',
      url: '/users',
      payload,
    };
  },

  addAuthOption(payload) {
    return {
      method: 'POST',
      url: 'authentication',
      payload,
    };
  },

  addThreadOption(payload, auth) {
    return {
      method: 'POST',
      url: 'thread',
      payload,
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    };
  },

  addCommentOption(payload, threadId, auth) {
    return {
      method: 'POST',
      url: `threads/${threadId}/comments`,
      payload,
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    };
  },

  addCommentReplayOption(payload, threadId, commentId, auth) {
    return {
      method: 'POST',
      url: `threads/${threadId}/comments/${commentId}/replies`,
      payload,
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    };
  },
};

module.exports = ServerInjectionFunctionHelper;
