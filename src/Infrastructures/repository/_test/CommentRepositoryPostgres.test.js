const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const addComment = new AddComment({
        owner: 'user-123',
        threadId: 'thread-123',
        content: 'Content comment',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');

      expect(comments).toHaveLength(1);
      expect(comments[0]).toHaveProperty('date'); // Hanya di cek atributnya karena atribut date default value

      expect(comments[0].id).toStrictEqual('comment-123');
      expect(comments[0].owner).toStrictEqual('user-123');
      expect(comments[0].thread_id).toStrictEqual('thread-123');
      expect(comments[0].content).toStrictEqual('Content comment');
      expect(comments[0].is_delete).toStrictEqual(false);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const addComment = new AddComment({
        owner: 'user-123',
        threadId: 'thread-123',
        content: 'Content comment',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        owner: 'user-123',
        content: 'Content comment',
      }));
    });
  });

  describe('detailComments function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      const comments = await commentRepositoryPostgres.detailComments('thread-123');

      expect(comments).toHaveLength(0);
    });

    it('should persist detail Comment when threadId correctly', async () => {
      // Arrange
      const dateComment1Now = new Date('2023-11-20T05:33:10.996Z');
      const dateComment2Now = new Date('2023-11-20T05:33:10.922Z');
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', date: dateComment1Now });
      await CommentsTableTestHelper.addComment({ id: 'comment-12345', isDelete: true, date: dateComment2Now });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.detailComments('thread-123');

      // Assert
      expect(comments).toHaveLength(2);

      expect(comments[1]).toStrictEqual(new DetailComment({
        id: 'comment-123',
        username: 'dicoding',
        date: dateComment1Now,
        content: 'Content comment',
        isDelete: false,
      }));

      expect(comments[0]).toStrictEqual(new DetailComment({
        id: 'comment-12345',
        username: 'dicoding',
        date: dateComment2Now,
        content: 'Content comment',
        isDelete: true,
      }));
    });
  });

  describe('verifyComment function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyComment('user-123', 'thread-123', 'comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw InvariantError when comment is deleted', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', isDelete: true });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyComment('user-123', 'thread-123', 'comment-123'))
        .rejects.toThrowError(InvariantError);
    });

    it('should throw InvariantError when thread is wrong', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyComment('user-123', 'thread-12345', 'comment-123'))
        .rejects.toThrowError(InvariantError);
    });

    it('should throw AuthorizationError when owner is not Authorization in Comment', async () => {
      // Arrange

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: 'user-12345', username: 'dicoding-indonesia' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-12345' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyComment('user-123', 'thread-123', 'comment-123'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should correcly when comment available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyComment('user-123', 'thread-123', 'comment-123'))
        .resolves.not.toThrowError(NotFoundError);
      await expect(commentRepositoryPostgres.verifyComment('user-123', 'thread-123', 'comment-123'))
        .resolves.not.toThrowError(AuthorizationError);
      await expect(commentRepositoryPostgres.verifyComment('user-123', 'thread-123', 'comment-123'))
        .resolves.not.toThrowError(InvariantError);
    });
  });

  describe('deleteComment function', () => {
    it('should persist Delete Comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const findComments = await CommentsTableTestHelper.findCommentsById('comment-123');

      expect(findComments).toHaveLength(1);
      expect(findComments[0]).toHaveProperty('is_delete');
      expect(findComments[0].is_delete).toStrictEqual(true);
    });
  });
});
