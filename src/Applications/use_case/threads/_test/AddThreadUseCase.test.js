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
    };

    const useCaseCredential = {
      id: 'user-123',
    };

    const mockNewThread = new NewThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCaseCredential.id,
    });

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();

    mockUserRepository.verifyAvailableUser = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.addNewThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockNewThread));

    const getThreadUseCase = new AddThreadUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
    });

    const newThread = await getThreadUseCase.execute(useCaseCredential, useCasePayload);

    expect(newThread).toStrictEqual(
      new NewThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: useCaseCredential.id,
      }),
    );

    expect(mockUserRepository.verifyAvailableUser).toBeCalledWith(useCaseCredential.id);
    expect(mockThreadRepository.addUser).toBeCalledWith(
      new AddedThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      }),
    );
  });
});
