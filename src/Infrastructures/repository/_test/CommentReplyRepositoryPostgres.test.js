const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedCommentReply = require('../../../Domains/replies/entities/AddedCommentReply');
const NewCommentReply = require('../../../Domains/replies/entities/NewCommentReply');
const pool = require('../../database/postgres/pool');
const CommentReplyRepositoryPostgres = require('../CommentReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
    });
  });

  afterEach(async () => {
    await CommentRepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentRepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('create function', () => {
    it('should persist new threreplyad and return added reply correctly', async () => {
      // Arrange
      const useCasePayload = new AddedCommentReply({
        content: 'sebuah balasan',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const fakeIdGenerator = () => '123';
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const newReply = await commentReplyRepositoryPostgres.create(useCasePayload);
      const reply = await CommentRepliesTableTestHelper.findCommentReplyById('reply-123');

      // Assert
      expect(newReply).toStrictEqual(
        new NewCommentReply({
          id: 'reply-123',
          content: 'sebuah balasan',
          owner: 'user-123',
        }),
      );
      expect(reply).toHaveLength(1);
    });
  });

  describe('getByThreadId function', () => {
    it('should throw 404 when id thread not found', async () => {
      // Arrange
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});

      // Action & Assert
      // return expect(commentReplyRepositoryPostgres.getByThreadId('xxx')).rejects.toThrowError(
      //   NotFoundError,
      // );
    });

    it('should return thread correctly', async () => {
      // Arrange
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});

      // Action
      await CommentRepliesTableTestHelper.addCommentReply({ id: 'reply-123' });
      const reply = await commentReplyRepositoryPostgres.getByThreadId('thread-123');

      // Assert
      expect(reply).toStrictEqual([
        {
          id: 'reply-123',
          content: 'sebuah balasan',
          date: new Date('10-05-2000'),
          comment_id: 'comment-123',
          is_deleted: false,
          username: 'dicoding',
        },
      ]);
    });
  });

  describe('validate function', () => {
    it('should throw 404 when id thread not found', async () => {
      // Arrange
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});

      // Action & Assertcomments
      return expect(commentReplyRepositoryPostgres.validate('xxx')).rejects.toThrowError(
        NotFoundError,
      );
    });

    it('should return thread correctly', async () => {
      // Arrange
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});

      // Action
      await CommentRepliesTableTestHelper.addCommentReply({ id: 'reply-123' });

      // Assert
      return expect(commentReplyRepositoryPostgres.validate('reply-123')).resolves.not.toThrowError(
        NotFoundError,
      );
    });
  });

  describe('delete function', () => {
    it('should throw 404 when id comment not found', async () => {
      // Arrange
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentReplyRepositoryPostgres.delete({ replyId: 'reply-123', owner: 'user-123' })).rejects.toThrowError(
        AuthorizationError,
      );
    });

    it('should return thread correctly', async () => {
      // Arrange
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});

      // Action
      await CommentRepliesTableTestHelper.addCommentReply({ id: 'reply-123' });
      await commentReplyRepositoryPostgres.delete({ replyId: 'reply-123', owner: 'user-123' });
      const reply = await CommentRepliesTableTestHelper.findCommentReplyById('reply-123');

      // Assert
      return expect(reply[0].is_deleted).toEqual(true);
    });
  });
});
