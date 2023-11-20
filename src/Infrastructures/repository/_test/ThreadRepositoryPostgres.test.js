const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('create function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      const useCasePayload = new AddedThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newThread = await threadRepositoryPostgres.create(useCasePayload);
      const thread = await ThreadsTableTestHelper.getThreadById('thread-123');

      // Assert
      expect(newThread).toStrictEqual(
        new NewThread({
          id: 'thread-123',
          title: 'sebuah thread',
          owner: 'user-123',
        }),
      );
      expect(thread).toHaveLength(1);
    });
  });

  describe('getById function', () => {
    it('should throw 404 when id thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.getById('xxx')).rejects.toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const thread = await threadRepositoryPostgres.getById('thread-123');

      // Assert
      expect(thread).toStrictEqual(
        new ThreadDetail({
          id: 'thread-123',
          title: 'sebuah thread',
          body: 'sebuah body thread',
          date: new Date('10-05-2000'),
          username: 'dicoding',
        }),
      );
    });
  });

  describe('validate function', () => {
    it('should throw 404 when id thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.validate('xxx')).rejects.toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      // Assert
      return expect(threadRepositoryPostgres.validate('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });
});
