const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('create function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const useCasePayload = new AddedComment({
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newComment = await commentRepositoryPostgres.create(useCasePayload);
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');

      // Assert
      expect(newComment).toStrictEqual(
        new NewComment({
          id: 'comment-123',
          content: 'sebuah comment',
          owner: 'user-123',
        }),
      );
      expect(comment).toHaveLength(1);
    });
  });

  describe('getByThreadId function', () => {
    it('should throw 404 when id thread not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.getByThreadId('xxx')).rejects.toThrowError(
        NotFoundError,
      );
    });

    it('should return thread correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const comment = await commentRepositoryPostgres.getByThreadId('thread-123');

      // Assert
      expect(comment).toStrictEqual([
        {
          id: 'comment-123',
          content: 'sebuah comment',
          date: new Date('10-05-2000'),
          is_deleted: false,
          username: 'dicoding',
        },
      ]);
    });
  });

  describe('validate function', () => {
    it('should throw 404 when id thread not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.validate('xxx')).rejects.toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      // Assert
      return expect(commentRepositoryPostgres.validate('comment-123')).resolves.not.toThrowError(
        NotFoundError,
      );
    });
  });

  describe('delete function', () => {
    it('should throw 404 when id comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.delete('xxx')).rejects.toThrowError(AuthorizationError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await commentRepositoryPostgres.delete('comment-123');
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');

      // Assert
      return expect(comment[0].is_deleted).toEqual(true);
    });
  });
});
