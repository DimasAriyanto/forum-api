const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const CommentDetail = require('../../Domains/comments/entities/CommentDetail');
const NewComment = require('../../Domains/comments/entities/NewComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addNewComment(threadId, userId, comment) {
    const { content } = comment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date();
    const isDeleted = false;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) returning id, content, user_id',
      values: [id, content, date, userId, threadId, isDeleted],
    };

    const result = await this._pool.query(query);

    return new NewComment({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].user_id,
    });
  }

  async getCommentById(threadId) {
    const query = {
      text: `SELECT comments.id, comments.content, comments.date, users.username
             FROM comments
             INNER JOIN users
             ON comments.user_id = users.id
             WHERE comments.thread_id = $1
             ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    // return new CommentDetail({ ...rows });
    return rows;
  }

  async verifyAvailableComment(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('comment tidak tersedia');
    }

    return result.rows[0].id;
  }

  async deleteComment(commentId) {
    const deletedContent = '**komentar telah dihapus**';

    const query = {
      text: 'UPDATE comments SET content = $1, is_deleted = true WHERE id = $2 RETURNING id',
      values: [deletedContent, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('gagal menghapus content');
    }

    return result.rowCount;
  }
}

module.exports = CommentRepositoryPostgres;
