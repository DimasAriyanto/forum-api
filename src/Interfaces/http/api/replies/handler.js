const AddCommentReplyUseCase = require('../../../../Applications/use_case/replies/AddCommentReplyUseCase');
const DeleteCommentReplyUseCase = require('../../../../Applications/use_case/replies/DeleteReplyUseCase');

class CommentRepliesHandler {
  constructor(container) {
    this._container = container;
    this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this);
    this.deleteCommentReplyHandler = this.deleteCommentReplyHandler.bind(this);
  }

  async postCommentReplyHandler(request, h) {
    const useCasePayload = {
      content: request.payload.content,
      owner: request.auth.credentials.id,
      commentId: request.params.commentId,
      threadId: request.params.threadId,
    };
    const addCommentReplyUseCase = this._container.getInstance(AddCommentReplyUseCase.name);
    const addedReply = await addCommentReplyUseCase.execute(useCasePayload);

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
    const useCasePayload = {
      owner: request.auth.credentials.id,
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      replyId: request.params.replyId,
    };
    const deleteCommentReplyUseCase = this._container.getInstance(DeleteCommentReplyUseCase.name);
    await deleteCommentReplyUseCase.execute(useCasePayload);

    return {
      status: 'success',
    };
  }
}

module.exports = CommentRepliesHandler;
