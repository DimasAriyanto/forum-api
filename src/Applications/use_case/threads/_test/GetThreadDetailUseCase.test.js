const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const CommentReplyRepository = require('../../../../Domains/replies/CommentReplyRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const ThreadDetail = require('../../../../Domains/threads/entities/ThreadDetail');
const UserRepository = require('../../../../Domains/users/UserRepository');
const GetDetailThreadUseCase = require('../GetThreadDetailUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating get the detail thread', async () => {
    const user = {
      id: 'user-123',
      username: 'dicoding',
    };

    const mockThreadData = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2000-05-10',
      user_id: 'user-123',
    };

    const commentData = [
      {
        id: 'comment-123',
        content: 'sebuah comment pertama',
        date: '2000-05-10',
        username: 'dicoding',
        user_id: 'user-123',
        thread_id: 'thread-123',
      },
      {
        id: 'comment-234',
        content: 'sebuah comment kedua',
        date: '2000-05-10',
        username: 'dicoding',
        user_id: 'user-123',
        thread_id: 'thread-123',
      },
    ];

    const replyData = [
      {
        id: 'reply-123',
        content: 'sebuah balasan pertama',
        date: '2000-05-10',
        user_id: 'user-123',
        comment_id: 'comment-123',
      },
      {
        id: 'reply-234',
        content: 'sebuah balasan kedua',
        date: '2000-05-10',
        username: 'dicoding',
        user_id: 'user-123',
        comment_id: 'comment-123',
      },
    ];

    const mockCommentReplyRepository = new CommentReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadData));
    mockUserRepository.getUsernameById = jest.fn().mockImplementation();
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentData));
    mockCommentReplyRepository.getCommentReplyById = jest.fn().mockImplementation();

    const getDetailTHreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadData,
      commentRepository: mockCommentRepository,
      commentReplyRepository: mockCommentReplyRepository,
      userRepository: mockUserRepository,
    });

    const threadDetail = await getDetailTHreadUseCase.execute(mockThreadData.id);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      new ThreadDetail({
        id: mockThreadData.id,
        title: mockThreadData.title,
        body: mockThreadData.body,
        date: mockThreadData.date.toString(),
        username: user.username,
        comments: [],
      }),
    );
    expect(mockUserRepository.getUsernameById).toBeCalledWith(user.username);
    expect(threadDetail.comments).toHaveLength(commentData.length);
  });
});
