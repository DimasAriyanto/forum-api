const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when payload did not contain right property', () => {
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload contain wrong data type', () => {
    const payload = {
      id: 123,
      content: 'sebuah comment',
      owner: 'user-123',
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.PROPORTY_NOT_MEET_DATA_TYPE_NEEDED');
  });

  it('should create addedThread object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    };

    const addedComment = new NewComment(payload);

    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
