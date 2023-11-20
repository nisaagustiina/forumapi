const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      const thread = new AddThread({
        owner: 'user-123',
        title: 'Title thread',
        body: 'Body thread',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(thread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');

      expect(threads).toHaveLength(1);
      expect(threads[0]).toHaveProperty('date'); // Hanya di cek atributnya karena atribut date default value

      expect(threads[0].id).toStrictEqual('thread-123');
      expect(threads[0].owner).toStrictEqual('user-123');
      expect(threads[0].title).toStrictEqual('Title thread');
      expect(threads[0].body).toStrictEqual('Body thread');
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      const thread = new AddThread({
        owner: 'user-123',
        title: 'Title thread',
        body: 'Body thread',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(thread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        owner: 'user-123',
        title: 'Title thread',
      }));
    });
  });

  describe('detailThread function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.detailThread('thread-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should return detail thread correctly', async () => {
      // Arrange
      const dateNow = new Date();
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', date: dateNow });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const detailThread = await threadRepositoryPostgres.detailThread('thread-123');

      // Assert
      expect(detailThread).toStrictEqual(new DetailThread({
        id: 'thread-123',
        username: 'dicoding',
        date: dateNow,
        title: 'Title thread',
        body: 'Body thread',
        comments: [],
      }));
    });
  });

  describe('verifyThread function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThread('thread-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThread('thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
});
