const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 when missing authentication', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah comment',
      };
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      // action
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when invalid thread', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah comment',
      };
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      // action
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      const response = await server.inject({
        method: 'POST',
        url: `/threads/xxx/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when invalid comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah comment',
      };
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      // action
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/xxx/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 400 when bad payload', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      // action
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 201 and new replies', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah comment',
      };
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      // action
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId)', () => {
    it('should response 401 when missing authentication', async () => {
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      // action
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      const responseReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'sebuah balasan',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      // Assert
      const responseReplyJson = JSON.parse(responseReply.payload);
      const replyId = responseReplyJson.data.addedReply.id;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      });
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when not found reply', async () => {
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      // action
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/xxx`,
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 200 and delete comment data', async () => {
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      // action
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      const threadId = responseThreadJson.data.addedThread.id;

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseCommentJson = JSON.parse(responseComment.payload);
      const commentId = responseCommentJson.data.addedComment.id;

      const responseReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'sebuah balasan',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      // Assert
      const responseReplyJson = JSON.parse(responseReply.payload);
      const replyId = responseReplyJson.data.addedReply.id;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
