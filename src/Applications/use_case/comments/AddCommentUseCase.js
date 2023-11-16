const AddedComment = require('../../../Domains/comments/entities/AddedComment');

class AddCommentUseCase {
  constructor({ userRepository, threadRepository, commentRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, userId, useCasePayload) {
    await this._userRepository.verifyAvailableUser(userId);
    await this._threadRepository.verifyAvailableThread(threadId);
    const newComment = new AddedComment(useCasePayload);

    return this._commentRepository.addNewComment(threadId, userId, newComment);
  }
}

module.exports = AddCommentUseCase;
