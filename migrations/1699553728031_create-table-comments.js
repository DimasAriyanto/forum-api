/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    content: {
      type: 'text',
      notNull: true,
    },
    createdAt: {
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
    is_deleted: {
      type: 'boolean',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'comments',
    'fk_comments.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'comments',
    'fk_comments.thread_id_threads.id',
    'FOREIGN KEY(thread_id) REFERENCES threads (id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'fk_comments.user_id_users.id');
  pgm.dropConstraint('comments', 'fk_comments.thread_id_threads.id');

  pgm.dropTable('comments');
};
