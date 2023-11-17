const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {});

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  describe('behavior test', () => {
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

    describe('addComment function', () => {
      it('should persist new thread and return added thread correctly', async () => {
        const credentialId = {
          userId: 'user-123',
        };

        const requestPayload = {
          threadId: 'thread-123',
        };

        const newComment = new AddedComment({
          content: 'sebuah comment',
        });

        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const addedComment = await commentRepositoryPostgres.addNewComment(
          requestPayload.threadId,
          credentialId.userId,
          newComment,
        );

        // Assert
        const comments = await CommentsTableTestHelper.findCommentById('comment-123');
        expect(addedComment).toStrictEqual(
          new NewComment({
            id: 'comment-123',
            content: 'sebuah comment',
            owner: 'user-123',
          }),
        );
        expect(comments).toHaveLength(1);
      });

      it('should return added thread correctly', async () => {
        const credentialId = {
          userId: 'user-123',
        };

        const requestPayload = {
          threadId: 'thread-123',
        };

        const newComment = new AddedComment({
          content: 'sebuah comment',
        });

        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const addedComment = await commentRepositoryPostgres.addNewComment(
          requestPayload.threadId,
          credentialId.userId,
          newComment,
        );

        // Assert
        expect(addedComment).toStrictEqual(
          new NewComment({
            id: 'comment-123',
            content: 'sebuah comment',
            owner: 'user-123',
          }),
        );
      });
    });
  });
});
