const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentRepliesTableTestHelper = {
  async addCommentReply({
    id = 'reply-123',
    content = 'sebuah balasan',
    date = new Date('10-05-2000'),
    owner = 'user-123',
    threadId = 'thread-123',
    commentId = 'comment-123',
    isDeleted = false,
  }) {
    const query = {
      text: 'INSERT INTO comment_replies VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, date, owner, threadId, commentId, isDeleted],
    };

    await pool.query(query);
  },

  async findCommentReplyById(id) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_replies WHERE 1 = 1');
  },
};

module.exports = CommentRepliesTableTestHelper;
