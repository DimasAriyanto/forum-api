const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.verifyAvailableUser = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.validate = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.validate = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.delete = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockUserRepository.verifyAvailableUser).toBeCalledWith(useCasePayload.owner);
    expect(mockThreadRepository.validate).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.validate).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.delete).toBeCalledWith(useCasePayload);
  });
});
