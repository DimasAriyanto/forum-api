class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, replies,
    } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.replies = replies;
  }

  _verifyPayload({
    id, username, date, content, replies,
  }) {
    if (!id || !username || !date || !content || !replies) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'string'
      || typeof content !== 'string'
      || !Array.isArray(replies)
    ) {
      throw new Error('THREAD_DETAIL.PROPORTY_NOT_MEET_DATA_TYPE_NEEDED');
    }
  }
}

module.exports = CommentDetail;
