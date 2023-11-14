const CommentDetail = require('../CommentDetail');

describe('a CommentDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      replies: [],
    };

    expect(() => new CommentDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload property did not meet data type needed', () => {
    const payload = {
      id: 123,
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      replies: [],
    };

    expect(() => new CommentDetail(payload)).toThrowError('THREAD_DETAIL.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED');
  });

  it('should create CommentDetail object correctly', () => {
    const payload = {
      id: 'comment-q_0uToswNf6i24RDYZJI3',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      replies: [],
    };

    const commentDetail = new CommentDetail(payload);

    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.replies).toEqual(payload.replies);
  });
});
