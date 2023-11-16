const AddCommentReplyUseCase = require('../../../../Applications/use_case/replies/AddCommentReplyUseCase');
const DeleteCommentReplyUseCase = require('../../../../Applications/use_case/replies/DeleteCommentReplyUseCase');

class CommentRepliesHandler {
  constructor(container) {
    this._container = container;
    this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this);
    this.deleteCommentReplyHandler = this.deleteCommentReplyHandler.bind(this);
  }

  async postCommentReplyHandler(request, h) {
    const addCommentReplyUseCase = this._container.getInstance(AddCommentReplyUseCase.name);
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const addedReply = await addCommentReplyUseCase.execute(
      threadId,
      commentId,
      userId,
      request.payload,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentReplyHandler(request) {
    const deleteCommentReplyUseCase = this._container.getInstance(DeleteCommentReplyUseCase.name);
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;

    await deleteCommentReplyUseCase.execute(userId, threadId, commentId, replyId);

    return {
      status: 'success',
    };
  }
}

module.exports = CommentRepliesHandler;
