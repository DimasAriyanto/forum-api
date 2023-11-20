const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentRepliesTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 when missing authentication', async () => {
      // Arrange
      await ServerTestHelper.getAccessToken();

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });

      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: 'user-123', threadId });

      const server = await createServer(container);
      const requestPayload = {
        content: 'sebuah balasan',
      };

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
      const accessToken = await ServerTestHelper.getAccessToken();

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });

      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: 'user-123', threadId });

      const server = await createServer(container);
      const requestPayload = {
        content: 'sebuah balasan',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/xxx/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when invalid comment', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken();

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });

      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: 'user-123', threadId });

      const server = await createServer(container);
      const requestPayload = {
        content: 'sebuah balasan',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/xxx/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 400 when bad payload', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken();

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });

      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: 'user-123', threadId });

      const server = await createServer(container);
      const requestPayload = {
        content: 123,
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 201 and new replies', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken();

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });

      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: 'user-123', threadId });

      const server = await createServer(container);
      const requestPayload = {
        content: 'sebuah balasan',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
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
      // Arrange
      await ServerTestHelper.getAccessToken();

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });

      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: 'user-123', threadId });

      const replyId = 'reply-123';
      await CommentRepliesTableTestHelper.addCommentReply({
        id: replyId, owner: 'user-123', threadId, commentId,
      });

      const server = await createServer(container);

      // Action
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
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken();

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });

      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: 'user-123', threadId });

      const replyId = 'reply-123';
      await CommentRepliesTableTestHelper.addCommentReply({
        id: replyId, owner: 'user-123', threadId, commentId,
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/xxx`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 200 and delete comment data', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken();

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });

      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: 'user-123', threadId });

      const replyId = 'reply-123';
      await CommentRepliesTableTestHelper.addCommentReply({
        id: replyId, owner: 'user-123', threadId, commentId,
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
