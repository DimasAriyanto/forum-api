const AddedCommentReply = require('../../../Domains/replies/entities/AddedCommentReply');

class AddCommentReplyUseCase {
  constructor({
    threadRepository, commentRepository, userRepository, commentReplyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._userRepository = userRepository;
    this._commentReplyRepository = commentReplyRepository;
  }

  async execute(useCasePayload) {
    const { owner, threadId, commentId } = useCasePayload;
    await this._userRepository.verifyAvailableUser(owner);
    await this._threadRepository.validate(threadId);
    await this._commentRepository.validate(commentId);
    const reply = new AddedCommentReply(useCasePayload);

    return this._commentReplyRepository.create(reply);
  }
}

module.exports = AddCommentReplyUseCase;
