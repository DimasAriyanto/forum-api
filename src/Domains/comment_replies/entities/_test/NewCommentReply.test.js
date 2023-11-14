const NewCommentReply = require('../NewCommentReply');

describe('a NewCommentReply entities', () => {
  it('should throw error when payload did not contain right property', () => {
    const payload = {
      id: 'reply-BErOXUSefjwWGW1Z10Ihk',
      content: 'sebuah balasan',
    };

    expect(() => new NewCommentReply(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload contain wrong data type', () => {
    const payload = {
      id: 123,
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    expect(() => new NewCommentReply(payload)).toThrowError('NEW_COMMENT.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED');
  });

  it('should create addedThread object correctly', () => {
    const payload = {
      id: 'reply-BErOXUSefjwWGW1Z10Ihk',
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    const addedReply = new NewCommentReply(payload);

    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
