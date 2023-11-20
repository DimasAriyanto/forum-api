const AddedThread = require('../../../Domains/threads/entities/AddedThread');

class AddThreadUseCase {
  constructor({ userRepository, threadRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { owner } = useCasePayload;
    await this._userRepository.verifyAvailableUser(owner);
    const thread = new AddedThread(useCasePayload);

    return this._threadRepository.create(thread);
  }
}

module.exports = AddThreadUseCase;
