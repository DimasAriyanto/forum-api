class AddedCommentReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      content, owner, threadId, commentId,
    } = payload;

    this.content = content;
    this.owner = owner;
    this.threadId = threadId;
    this.commentId = commentId;
  }

  _verifyPayload({
    content, owner, threadId, commentId,
  }) {
    if (!content || !owner || !threadId || !commentId) {
      throw new Error('ADDED_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string'
      || typeof owner !== 'string'
      || typeof threadId !== 'string'
      || typeof commentId !== 'string'
    ) {
      throw new Error('ADDED_COMMENT_REPLY.PROPORTY_NOT_MEET_DATA_TYPE_NEEDED');
    }
  }
}

module.exports = AddedCommentReply;
