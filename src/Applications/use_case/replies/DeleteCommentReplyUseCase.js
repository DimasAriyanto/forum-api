class DeleteCommentReplyUseCase {
  constructor({ userRepository, threadRepository, commentRepository, commentReplyRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentReplyRepository = commentReplyRepository;
  }

  async execute(userId, threadId, commentId, replyId) {
    await this._userRepository.verifyAvailableUser(userId);
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._commentReplyRepository.verifyAvailableReply(replyId);

    return this._commentReplyRepository.deleteCommentReply(replyId, userId, threadId, commentId);
  }
}

module.exports = DeleteCommentReplyUseCase;
