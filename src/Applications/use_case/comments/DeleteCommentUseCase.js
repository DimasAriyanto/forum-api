class DeleteCommentUseCase {
  constructor({ userRepository, threadRepository, commentRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { owner, threadId, commentId } = useCasePayload;
    await this._userRepository.verifyAvailableUser(owner);
    await this._threadRepository.validate(threadId);
    await this._commentRepository.validate(commentId);

    return this._commentRepository.delete(useCasePayload);
  }
}

module.exports = DeleteCommentUseCase;
