const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload property did not meet data type needed', () => {
    const payload = {
      content: 123,
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED');
  });

  it('should create addedCoAddedComment object correctly', () => {
    const payload = {
      content: 'sebuah comment',
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment.content).toEqual(payload.content);
  });
});
