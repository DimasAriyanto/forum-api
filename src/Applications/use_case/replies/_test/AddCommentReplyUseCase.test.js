const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const CommentReplyRepository = require('../../../../Domains/replies/CommentReplyRepository');
const AddedCommentReply = require('../../../../Domains/replies/entities/AddedCommentReply');
const NewCommentReply = require('../../../../Domains/replies/entities/NewCommentReply');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const AddCommentReplyUseCase = require('../AddCommentReplyUseCase');

describe('AddCommentReplyUseCase', () => {
  it('should orchestrating the add comment reply action correctly', async () => {
    const useCasePayload = {
      content: 'sebuah balasan',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockNewReply = new NewCommentReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new CommentReplyRepository();

    mockUserRepository.verifyAvailableUser = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.validate = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.validate = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.create = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockNewReply));

    const getCommentUseCase = new AddCommentReplyUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentReplyRepository: mockReplyRepository,
    });

    const newComment = await getCommentUseCase.execute(useCasePayload);

    expect(newComment).toStrictEqual(
      new NewCommentReply({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }),
    );

    expect(mockUserRepository.verifyAvailableUser).toBeCalledWith(useCasePayload.owner);
    expect(mockThreadRepository.validate).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.validate).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.create).toBeCalledWith(
      new AddedCommentReply({
        content: 'sebuah balasan',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      }),
    );
  });
});
