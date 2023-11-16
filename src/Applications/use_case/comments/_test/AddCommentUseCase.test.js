const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../../Domains/comments/entities/NewComment');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'sebuah comment',
    };

    const useCaseCredential = {
      id: 'user-123',
    };

    const useCaseThread = {
      id: 'thread-123',
    };

    const mockNewComment = new NewComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCaseThread.id,
    });

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.verifyAvailableUser = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addNewComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockNewComment));

    const getCommentUseCase = new AddCommentUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const newComment = await getCommentUseCase.execute(
      useCaseThread,
      useCaseCredential,
      useCasePayload,
    );

    expect(newComment).toStrictEqual(
      new NewComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCaseThread.id,
      }),
    );

    expect(mockUserRepository.verifyAvailableUser).toBeCalledWith(useCaseCredential.id);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseThread.id);
    expect(mockCommentRepository.addNewComment).toBeCalledWith(
      new AddedComment({
        content: useCasePayload.content,
      }),
    );
  });
});
