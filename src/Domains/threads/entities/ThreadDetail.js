class ThreadDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, title, body, date, username, comments, replies,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
    this.replies = replies;
  }

  _verifyPayload(id, body, title, date, username, comments, replies) {
    if (!id || !title || !body || !date || !username || !comments || !replies) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || typeof date !== 'string'
      || typeof comments !== 'string'
      || !Array.isArray(comments)
      || !Array.isArray(replies)
    ) {
      throw new Error('THREAD_DETAIL.PROPORTY_NOT_MEET_DATA_TYPE_NEEDED');
    }
  }
}

module.exports = ThreadDetail;
