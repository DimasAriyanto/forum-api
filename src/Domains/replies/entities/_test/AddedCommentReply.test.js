const AddedCommentReply = require('../AddedCommentReply');

describe('a AddedCommentReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    expect(() => new AddedCommentReply(payload)).toThrowError('ADDED_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload property did not meet data type needed', () => {
    const payload = {
      content: 123,
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    expect(() => new AddedCommentReply(payload)).toThrowError('ADDED_COMMENT_REPLY.PROPORTY_NOT_MEET_DATA_TYPE_NEEDED');
  });

  it('should create addedCoAddedCommentReply object correctly', () => {
    const payload = {
      content: 'sebuah balasan',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const addedCommentReply = new AddedCommentReply(payload);

    expect(addedCommentReply.content).toEqual(payload.content);
    expect(addedCommentReply.owner).toEqual(payload.owner);
    expect(addedCommentReply.threadId).toEqual(payload.threadId);
    expect(addedCommentReply.commentId).toEqual(payload.commentId);
  });
});
