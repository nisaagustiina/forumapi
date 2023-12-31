const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      title: 'Title thread',
      body: 'Body thread',
    };

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'Title thread',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedThread({
        id: 'thread-123',
        title: 'Title thread',
        owner: 'user-123',
      })));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);

    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      owner: 'user-123',
      title: 'Title thread',
      body: 'Body thread',
    }));
  });
});
