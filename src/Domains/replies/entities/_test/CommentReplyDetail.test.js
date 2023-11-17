const CommentReplyDetail = require('../CommentReplyDetail');

describe('a CommentReplyDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'dicoding',
      date: '2000-05-10',
      content: 'sebuah balasan',
    };

    expect(() => new CommentReplyDetail(payload)).toThrowError('COMMENT_REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload property did not meet data type needed', () => {
    const payload = {
      id: 123,
      username: 'dicoding',
      date: '2000-05-10',
      content: 'sebuah balasan',
    };

    expect(() => new CommentReplyDetail(payload)).toThrowError('COMMENT_REPLY_DETAIL.PROPORTY_NOT_MEET_DATA_TYPE_NEEDED');
  });

  it('should create CommentReplyDetail object correctly', () => {
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: '2000-05-10',
      content: 'sebuah balasan',
    };

    const commentReplyDetail = new CommentReplyDetail(payload);

    expect(commentReplyDetail.id).toEqual(payload.id);
    expect(commentReplyDetail.username).toEqual(payload.username);
    expect(commentReplyDetail.date).toEqual(payload.date);
    expect(commentReplyDetail.content).toEqual(payload.content);
  });
});
