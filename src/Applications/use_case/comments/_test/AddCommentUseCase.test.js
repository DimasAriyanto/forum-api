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
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockNewComment = new NewComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.verifyAvailableUser = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.validate = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.create = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockNewComment));

    const getCommentUseCase = new AddCommentUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const newComment = await getCommentUseCase.execute(useCasePayload);

    expect(newComment).toStrictEqual(
      new NewComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }),
    );

    expect(mockUserRepository.verifyAvailableUser).toBeCalledWith(useCasePayload.owner);
    expect(mockThreadRepository.validate).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.create).toBeCalledWith(
      new AddedComment({
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      }),
    );
  });
});
