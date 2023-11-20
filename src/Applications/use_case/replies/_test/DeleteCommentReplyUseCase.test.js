const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const CommentReplyRepository = require('../../../../Domains/replies/CommentReplyRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('deleteReplyUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      replyId: 'reply-123',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentReplyRepository = new CommentReplyRepository();

    mockUserRepository.verifyAvailableUser = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.validate = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.validate = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentReplyRepository.validate = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentReplyRepository.delete = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentReplyRepository: mockCommentReplyRepository,
    });

    await deleteReplyUseCase.execute(useCasePayload);

    expect(mockUserRepository.verifyAvailableUser).toBeCalledWith(useCasePayload.owner);
    expect(mockThreadRepository.validate).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.validate).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentReplyRepository.validate).toBeCalledWith(useCasePayload.replyId);
    expect(mockCommentReplyRepository.delete).toBeCalledWith(useCasePayload);
  });
});
