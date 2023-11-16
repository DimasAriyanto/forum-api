const CommentDetail = require('../CommentDetail');

describe('a CommentDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'dicoding',
      date: '2000-10-05',
      content: 'sebuah comment',
      replies: [],
    };

    expect(() => new CommentDetail(payload)).toThrowError(
      'THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload property did not meet data type needed', () => {
    const payload = {
      id: 123,
      username: 'dicoding',
      date: '2000-10-05',
      content: 'sebuah comment',
      replies: [],
    };

    expect(() => new CommentDetail(payload)).toThrowError(
      'THREAD_DETAIL.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED',
    );
  });

  it('should create CommentDetail object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2000-10-05',
      content: 'sebuah comment',
      replies: [],
    };

    const commentDetail = new CommentDetail(payload);

    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.content).toEqual(payload.content);
    expect(commentDetail.replies).toEqual(payload.replies);
  });
});
