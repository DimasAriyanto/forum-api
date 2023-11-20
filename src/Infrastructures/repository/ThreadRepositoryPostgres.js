const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NewThread = require('../../Domains/threads/entities/NewThread');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async create(thread) {
    const { title, body, owner } = thread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) returning id, title, user_id',
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(query);

    return new NewThread({
      id: result.rows[0].id,
      title: result.rows[0].title,
      owner: result.rows[0].user_id,
    });
  }

  async getById(id) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username 
            FROM threads 
            LEFT JOIN users ON threads.user_id = users.id 
            WHERE threads.id = $1`,
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError('Thread not found');
    }
    return new ThreadDetail({ ...rows[0] });
  }

  async validate(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('thread tidak tersedia');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
