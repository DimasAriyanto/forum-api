const AddedCommentReply = require('../../../Domains/replies/entities/AddedCommentReply');

class AddCommentReplyUseCase {
  constructor({ threadRepository, commentRepository, userRepository, commentReplyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._userRepository = userRepository;
    this._commentReplyRepository = commentReplyRepository;
  }

  async execute(threadId, commentId, userId, useCasePayload) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._userRepository.verifyAvailableUser(userId);
    const newCommentReply = new AddedCommentReply(useCasePayload);

    return this._commentReplyRepository.addNewCommentReply(
      threadId,
      commentId,
      userId,
      newCommentReply,
    );
  }
}

module.exports = AddCommentReplyUseCase;
