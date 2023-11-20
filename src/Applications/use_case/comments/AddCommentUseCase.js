const AddedComment = require('../../../Domains/comments/entities/AddedComment');

class AddCommentUseCase {
  constructor({ userRepository, threadRepository, commentRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, owner } = useCasePayload;
    await this._userRepository.verifyAvailableUser(owner);
    await this._threadRepository.validate(threadId);
    const comment = new AddedComment(useCasePayload);

    return this._commentRepository.create(comment);
  }
}

module.exports = AddCommentUseCase;
