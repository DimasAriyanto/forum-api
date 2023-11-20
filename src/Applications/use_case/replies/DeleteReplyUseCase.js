class DeleteReplyUseCase {
  constructor({
    userRepository, threadRepository, commentRepository, commentReplyRepository,
  }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentReplyRepository = commentReplyRepository;
  }

  async execute(useCasePayload) {
    const {
      owner, threadId, commentId, replyId,
    } = useCasePayload;

    await this._userRepository.verifyAvailableUser(owner);
    await this._threadRepository.validate(threadId);
    await this._commentRepository.validate(commentId);
    await this._commentReplyRepository.validate(replyId);

    return this._commentReplyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
