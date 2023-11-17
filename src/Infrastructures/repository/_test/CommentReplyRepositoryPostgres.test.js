const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentReplyRepository = require('../../../Domains/replies/CommentReplyRepository');
const AddedCommentReply = require('../../../Domains/replies/entities/AddedCommentReply');
const NewCommentReply = require('../../../Domains/replies/entities/NewCommentReply');
const pool = require('../../database/postgres/pool');
const CommentReplyRepositoryPostgres = require('../CommentReplyRepositoryPostgres');

describe('CommentReplieRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres({}, {});

    expect(commentReplyRepositoryPostgres).toBeInstanceOf(CommentReplyRepository);
  });

  describe('behavior test', () => {
    beforeAll(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
    });

    afterEach(async () => {
      await CommentRepliesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await CommentRepliesTableTestHelper.cleanTable();
      await pool.end();
    });

    describe('addReply function', () => {
      it('should persist new thread and return added thread correctly', async () => {
        const credentialId = {
          userId: 'user-123',
        };

        const requestPayload = {
          threadId: 'thread-123',
          commentId: 'comment-123',
        };

        const newReply = new AddedCommentReply({
          content: 'sebuah balasan',
        });

        const fakeIdGenerator = () => '123';
        const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
          pool,
          fakeIdGenerator,
        );

        // Action
        const addedReply = await commentReplyRepositoryPostgres.addNewCommentReply(
          requestPayload.threadId,
          requestPayload.commentId,
          credentialId.userId,
          newReply,
        );

        // Assert
        const replies = await CommentRepliesTableTestHelper.findCommentReplyById('reply-123');
        expect(addedReply).toStrictEqual(
          new NewCommentReply({
            id: 'reply-123',
            content: 'sebuah balasan',
            owner: 'user-123',
          }),
        );
        expect(replies).toHaveLength(1);
      });

      it('should return added thread correctly', async () => {
        const credentialId = {
          userId: 'user-123',
        };

        const requestPayload = {
          threadId: 'thread-123',
          commentId: 'comment-123',
        };

        const newReply = new AddedCommentReply({
          content: 'sebuah balasan',
        });

        const fakeIdGenerator = () => '123';
        const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
          pool,
          fakeIdGenerator,
        );

        // Action
        const addedReply = await commentReplyRepositoryPostgres.addNewCommentReply(
          requestPayload.threadId,
          requestPayload.commentId,
          credentialId.userId,
          newReply,
        );

        // Assert
        expect(addedReply).toStrictEqual(
          new NewCommentReply({
            id: 'reply-123',
            content: 'sebuah balasan',
            owner: 'user-123',
          }),
        );
      });
    });
  });
});
