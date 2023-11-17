class GetDetailThreadUseCase {
  constructor({
    threadRepository, commentRepository, commentReplyRepository, userRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentReplyRepository = commentReplyRepository;
    this._userRepository = userRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    let comments = await this._commentRepository.getCommentById(threadId);
    const replies = await this._commentReplyRepository.getCommentReplyById(threadId);

    comments = comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.content,
      replies: replies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.content,
          date: reply.date,
          username: reply.username,
        })),
    }));

    return { ...thread, comments };
  }
}

module.exports = GetDetailThreadUseCase;
