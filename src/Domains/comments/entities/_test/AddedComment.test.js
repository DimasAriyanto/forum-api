const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload property did not meet data type needed', () => {
    const payload = {
      content: 123,
      threadId: 'thread-123',
      owner: 'user-123',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.PROPORTY_NOT_MEET_DATA_TYPE_NEEDED');
  });

  it('should create addedCoAddedComment object correctly', () => {
    const payload = {
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.threadId).toEqual(payload.threadId);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
