const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentRepliesTableTestHelper = {
  async addCommentReply({
    id = 'comment-replies-123',
    content = 'Sipp',
    createdAt = new Date(),
    userId = 'users-123',
    threadId = 'threads-123',
    commentId = 'comments-123',
    isDeleted = false,
  }) {
    const query = {
      text: 'INSERT INTO comment_replies VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, createdAt, userId, threadId, commentId, isDeleted],
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
