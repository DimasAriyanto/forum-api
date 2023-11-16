const AddedThread = require('../../../Domains/threads/entities/AddedThread');

class AddThreadUseCase {
  constructor({ userRepository, threadRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    await this._userRepository.verifyAvailableUser(userId);
    const thread = new AddedThread(useCasePayload);

    return this._threadRepository.addNewThread(userId, thread);
  }
}

module.exports = AddThreadUseCase;
