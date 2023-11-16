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
    };

    const useCaseCredential = {
      id: 'user-123',
    };

    const useCaseThread = {
      id: 'thread-123',
    };

    const useCaseComment = {
      id: 'thread-123',
    };

    const mockNewReply = new NewCommentReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCaseThread.id,
    });

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new CommentReplyRepository();

    mockUserRepository.verifyAvailableUser = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addNewCommentReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockNewReply));

    const getCommentUseCase = new AddCommentReplyUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentReplyRepository: mockReplyRepository,
    });

    const newComment = await getCommentUseCase.execute(
      useCaseThread,
      useCaseCredential,
      useCasePayload,
    );

    expect(newComment).toStrictEqual(
      new NewCommentReply({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: useCaseThread.id,
      }),
    );

    expect(mockUserRepository.verifyAvailableUser).toBeCalledWith(useCaseCredential.id);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseThread.id);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCaseComment.id);
    expect(mockReplyRepository.addNewCommentReply).toBeCalledWith(
      new AddedCommentReply({
        content: useCasePayload.content,
      }),
    );
  });
});
