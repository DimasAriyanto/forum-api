const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../../Domains/threads/entities/NewThread');
const UserRepository = require('../../../../Domains/users/UserRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
    };

    const mockNewThread = new NewThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();

    mockUserRepository.verifyAvailableUser = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.create = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockNewThread));

    const getThreadUseCase = new AddThreadUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
    });

    const newThread = await getThreadUseCase.execute(useCasePayload);

    expect(newThread).toStrictEqual(mockNewThread);

    expect(mockUserRepository.verifyAvailableUser).toBeCalledWith(useCasePayload.owner);
    expect(mockThreadRepository.create).toBeCalledWith(
      new AddedThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      }),
    );
  });
});
