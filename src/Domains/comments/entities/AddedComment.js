class AddedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content } = payload;

    this.content = content;
  }

  _verifyPayload(content) {
    if (!content) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('ADDED_COMMENT.PROPORTY_NOT_MEET_DATA_TYPE_NEEDED');
    }
  }
}

module.exports = AddedComment;
