const AddedCommentReply = require('../AddedCommentReply');

describe('a AddedCommentReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new AddedCommentReply(payload)).toThrowError('ADDED_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload property did not meet data type needed', () => {
    const payload = {
      content: 123,
    };

    expect(() => new AddedCommentReply(payload)).toThrowError('ADDED_COMMENT_REPLY.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED');
  });

  it('should create addedCoAddedCommentReply object correctly', () => {
    const payload = {
      content: 'sebuah balasan',
    };

    const addedCommentReply = new AddedCommentReply(payload);

    expect(addedCommentReply.content).toEqual(payload.content);
  });
});
