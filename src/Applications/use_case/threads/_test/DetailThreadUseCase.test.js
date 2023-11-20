const DetailThread = require('../../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../../Domains/comments/entities/DetailComment');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread without comment correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const dateNow = new Date();

    const thread = new DetailThread({
      id: 'thread-123',
      title: 'Title thread',
      body: 'Body thread',
      date: dateNow,
      username: 'dicoding',
      comments: [],
    });

    const comments = [];

    const expectedDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'Title thread',
      body: 'Body thread',
      date: dateNow,
      username: 'dicoding',
      comments: [],
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.detailComments = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));
    mockThreadRepository.detailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));

    /** creating use case instance */
    const detailThreadUseCase = new DetailThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const detailThread = await detailThreadUseCase.execute(threadId);

    // Assert
    expect(detailThread).toStrictEqual(expectedDetailThread);

    expect(mockThreadRepository.detailThread)
      .toBeCalledWith(threadId);
    expect(mockCommentRepository.detailComments)
      .toBeCalledWith(threadId);
  });

  it('should orchestrating the get thread with comment correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const dateNowThread = new Date();
    const dateNowComment = new Date();

    const thread = new DetailThread({
      id: 'thread-123',
      title: 'Title thread',
      body: 'Body thread',
      date: dateNowThread,
      username: 'dicoding',
      comments: [],
    });

    const comments = [
      new DetailComment({
        id: 'comment-123',
        username: 'dicoding',
        date: dateNowComment,
        content: 'Content comment',
        isDelete: true,
      }),
      new DetailComment({
        id: 'comment-124',
        username: 'dicoding',
        date: dateNowComment,
        content: 'Content comment',
        isDelete: false,
      }),
    ];

    const expectedDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'Title thread',
      body: 'Body thread',
      date: dateNowThread,
      username: 'dicoding',
      comments: [
        new DetailComment({
          id: 'comment-123',
          username: 'dicoding',
          date: dateNowComment,
          content: 'Content comment',
          isDelete: true,
        }),
        new DetailComment({
          id: 'comment-124',
          username: 'dicoding',
          date: dateNowComment,
          content: 'Content comment',
          isDelete: false,
        }),
      ],
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.detailComments = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));
    mockThreadRepository.detailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));

    /** creating use case instance */
    const detailThreadUseCase = new DetailThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const detailThread = await detailThreadUseCase.execute(threadId);

    // Assert
    expect(detailThread).toStrictEqual(expectedDetailThread);

    expect(mockThreadRepository.detailThread)
      .toBeCalledWith(threadId);
    expect(mockCommentRepository.detailComments)
      .toBeCalledWith(threadId);
  });
});
