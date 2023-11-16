const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentReplyRepository = require('../../Domains/replies/CommentReplyRepository');
const NewCommentReply = require('../../Domains/replies/entities/NewCommentReply');

class CommentReplyRepositoryPostgres extends CommentReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addNewCommentReply(threadId, commentId, userId, commentReply) {
    const { content } = commentReply;
    const id = `comment-reply-${this._idGenerator()}`;
    const date = new Date();
    const isDeleted = false;

    const query = {
      text: 'INSERT INTO comment_replies VALUES($1, $2, $3, $4, $5, $6, $7) returning id, content, user_id',
      values: [id, content, date, userId, threadId, commentId, isDeleted],
    };

    const result = await this._pool.query(query);

    return new NewCommentReply({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].user_id,
    });
  }

  async getCommentReplyById(id) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE comment_id = $1 ORDER BY date ASC',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifyAvailableReply(id) {
    const query = {
      text: 'SELECT id FROM comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('comment reply tidak tersedia');
    }

    return result.rows[0].id;
  }

  async deleteCommentReply(replyId, userId, threadId, commentId) {
    const deletedContent = '**balasan telah dihapus**';

    const query = {
      text: 'UPDATE comment_replies SET content = $1, is_deleted = true WHERE id = $2 AND user_id = $3 AND thread_id = $4 AND comment_id = $5 RETURNING id',
      values: [deletedContent, replyId, userId, threadId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('gagal menghapus content');
    }
  }
}

module.exports = CommentReplyRepositoryPostgres;
