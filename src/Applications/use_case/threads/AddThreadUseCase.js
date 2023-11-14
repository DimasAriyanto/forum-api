const AddedThread = require('../../../Domains/threads/entities/AddedThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const newThread = new AddedThread(useCasePayload);
    await this._threadRepository.verifyAvailableUser(userId);

    return this._threadRepository.addNewThread(userId, newThread);
  }
}

module.exports = AddThreadUseCase;
