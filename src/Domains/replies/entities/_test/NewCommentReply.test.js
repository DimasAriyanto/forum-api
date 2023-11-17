const NewCommentReply = require('../NewCommentReply');

describe('a NewCommentReply entities', () => {
  it('should throw error when payload did not contain right property', () => {
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
    };

    expect(() => new NewCommentReply(payload)).toThrowError('NEW_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload contain wrong data type', () => {
    const payload = {
      id: 123,
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    expect(() => new NewCommentReply(payload)).toThrowError('NEW_COMMENT_REPLY.PROPORTY_NOT_MEET_DATA_TYPE_NEEDED');
  });

  it('should create addedThread object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    const newCommentReply = new NewCommentReply(payload);

    expect(newCommentReply.id).toEqual(payload.id);
    expect(newCommentReply.content).toEqual(payload.content);
    expect(newCommentReply.owner).toEqual(payload.owner);
  });
});
