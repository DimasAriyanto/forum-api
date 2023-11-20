const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const CommentReplyRepository = require('../../../../Domains/replies/CommentReplyRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const GetDetailThreadUseCase = require('../GetThreadDetailUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating get the detail thread', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockComment = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
      },
    ];

    const mockReply = [
      {
        id: 'reply-123',
        content: 'sebuah balasan',
        date: '2021-08-08T08:07:01.522Z',
        comment_id: 'comment-123',
        username: 'dicoding',
      },
    ];

    const mappedComments = mockComment.map(({ ...otherProperties }) => otherProperties);
    const mappedReplies = mockReply.map(({ comment_id, ...otherProperties }) => otherProperties);

    const commentReplies = [
      {
        ...mappedComments[0],
        replies: mappedReplies,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentReplyRepository = new CommentReplyRepository();

    mockThreadRepository.getById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockCommentReplyRepository.getByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockReply));

    const mockGetThreadDetailUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentReplyRepository: mockCommentReplyRepository,
    });

    const datailThread = await mockGetThreadDetailUseCase.execute(useCasePayload.threadId);

    expect(datailThread).toStrictEqual({
      ...mockThread,
      comments: commentReplies,
    });
    expect(mockThreadRepository.getById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentReplyRepository.getByThreadId).toBeCalledWith(useCasePayload.threadId);
  });
});
