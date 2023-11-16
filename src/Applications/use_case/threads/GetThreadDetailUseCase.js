const CommentReplyDetail = require('../../../Domains/replies/entities/CommentReplyDetail');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');

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
    const dataThread = await this._threadRepository.getThreadById(threadId);
    const dataThreadUsername = await this._userRepository.getUsernameById(dataThread.user_id);

    const thread = new ThreadDetail({
      id: dataThread.id,
      title: dataThread.title,
      body: dataThread.body,
      date: dataThread.date.toString(),
      username: dataThreadUsername,
      comments: [],
    });

    const commentsInThread = await this._commentRepository.getCommentById(thread.id);

    if (commentsInThread.length > 0) {
      thread.comments = await Promise.all(
        commentsInThread.map(async (comment) => {
          const commentUsername = await this._userRepository.getUsernameById(comment.user_id);
          const commentDetail = new CommentDetail({
            id: comment.id,
            username: commentUsername,
            date: comment.date.toString(),
            replies: [],
            content: comment.content,
          });

          const replyInThread = await this._commentReplyRepository.getCommentReplyById(
            commentDetail.id,
          );

          if (replyInThread.length > 0) {
            commentDetail.replies = await Promise.all(
              replyInThread.map(async (reply) => {
                const replyUsername = await this._userRepository.getUsernameById(reply.user_id);
                const replyDetail = new CommentReplyDetail({
                  id: reply.id,
                  content: reply.content,
                  date: reply.date.toString(),
                  username: replyUsername,
                });

                return replyDetail;
              }),
            );
          }

          return commentDetail;
        }),
      );
    }
    return thread;
  }
}

module.exports = GetDetailThreadUseCase;
