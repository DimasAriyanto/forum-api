const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
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
      text: 'SELECT * FROM comments WHERE thread_id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
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

  async deleteComment(userId, threadId, commentId) {
    const deletedContent = '**komentar telah dihapus**';

    const query = {
      text: 'UPDATE comments SET content = $1, is_deleted = true WHERE id = $2  AND thread_id = $3 AND user_id = $4 RETURNING id',
      values: [deletedContent, commentId, threadId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('gagal menghapus content');
    }
  }
}

module.exports = CommentRepositoryPostgres;
