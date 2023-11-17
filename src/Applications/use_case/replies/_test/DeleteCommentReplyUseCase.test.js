const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const CommentReplyRepository = require('../../../../Domains/replies/CommentReplyRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const DeleteCommentReplyUseCase = require('../DeleteCommentReplyUseCase');

describe('DeleteCommentReplyUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      commentId: 'comment-123',
    };

    const useCaseCredential = {
      id: 'user-123',
    };

    const mockThread = {
      id: 'thread-123',
    };

    const mockComment = {
      id: 'comment-123',
    };

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentReplyRepository = new CommentReplyRepository();

    mockUserRepository.verifyAvailableUser = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentReplyRepository.verifyAvailableReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentReplyRepository.deleteCommentReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentReplyRepository: mockCommentReplyRepository,
    });

    await deleteCommentReplyUseCase.execute(useCasePayload);

    // expect(mockUserRepository.verifyAvailableUser).toBeCalledWith(useCaseCredential.id);
    // expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(mockThread.id);
    // expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
  });
});
