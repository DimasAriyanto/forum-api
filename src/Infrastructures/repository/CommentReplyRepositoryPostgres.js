const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentReplyRepository = require('../../Domains/replies/CommentReplyRepository');
const CommentReplyDetail = require('../../Domains/replies/entities/CommentReplyDetail');
const NewCommentReply = require('../../Domains/replies/entities/NewCommentReply');

class CommentReplyRepositoryPostgres extends CommentReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addNewCommentReply(threadId, commentId, userId, commentReply) {
    const { content } = commentReply;
    const id = `reply-${this._idGenerator()}`;
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
      text: `SELECT comment_replies.id, comment_replies.content, comment_replies.date, comment_replies.comment_id, users.username
            FROM comment_replies
            INNER JOIN users
            ON comment_replies.user_id = users.id
            WHERE comment_replies.thread_id = $1
            ORDER BY comment_replies.date ASC`,
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    // return new CommentReplyDetail({ ...rows });
    return rows;
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
  }

  async deleteCommentReply(replyId) {
    const deletedContent = '**balasan telah dihapus**';

    const query = {
      text: 'UPDATE comment_replies SET content = $1, is_deleted = true WHERE id = $2 RETURNING id',
      values: [deletedContent, replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('gagal menghapus content');
    }

    return result.rowCount;
  }
}

module.exports = CommentReplyRepositoryPostgres;
