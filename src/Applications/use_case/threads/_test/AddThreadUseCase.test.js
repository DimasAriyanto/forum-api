const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };

    const useCaseCredential = {
      id: 'user-123',
    };

    const mockAddedThread = new AddedThread({
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addNewThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    const getThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });

    const addedThread = await getThreadUseCase.exceute(useCasePayload, useCaseCredential);

    expect(addedThread).toStrictEqual(
      new AddThreadUseCase({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      }),
    );
  });
});
