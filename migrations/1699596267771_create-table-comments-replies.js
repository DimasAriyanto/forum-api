/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comment_replies', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    content: {
      type: 'text',
      notNull: true,
    },
    date: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
    },
    thread_id: {
      type: 'varchar(50)',
      notNull: true,
    },
    comment_id: {
      type: 'varchar(50)',
      notNull: true,
    },
    is_deleted: {
      type: 'boolean',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'comment_replies',
    'fk_comment_replies.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'comment_replies',
    'fk_comment_replies.thread_id_threads.id',
    'FOREIGN KEY(thread_id) REFERENCES threads (id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'comment_replies',
    'fk_comment_replies.comment_id_comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments (id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('comment_replies', 'fk_comment_replies.user_id_users.id');
  pgm.dropConstraint('comment_replies', 'fk_comment_replies.thread_id_threads.id');
  pgm.dropConstraint('comment_replies', 'fk_comment_replies.comment_id_comments.id');

  pgm.dropTable('comment_replies');
};
