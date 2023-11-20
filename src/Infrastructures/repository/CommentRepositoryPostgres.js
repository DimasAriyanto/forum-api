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

  async create(comment) {
    const { content, owner, threadId } = comment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date();
    const isDeleted = false;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) returning id, content, user_id',
      values: [id, content, date, owner, threadId, isDeleted],
    };

    const result = await this._pool.query(query);

    return new NewComment({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].user_id,
    });
  }

  async getByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.content, comments.date, comments.is_deleted, users.username
             FROM comments
             INNER JOIN users
             ON comments.user_id = users.id
             WHERE comments.thread_id = $1
             ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }

  async validate(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('comment tidak tersedia');
    }

    return result.rows[0].id;
  }

  async delete(useCasePayload) {
    const { commentId, owner } = useCasePayload;
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1 AND user_id = $2 RETURNING id',
      values: [commentId, owner],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new AuthorizationError('gagal menghapus content');
    }

    return rowCount;
  }
}

module.exports = CommentRepositoryPostgres;
