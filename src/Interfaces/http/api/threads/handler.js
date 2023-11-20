const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase');
const getThreadDetailHendler = require('../../../../Applications/use_case/threads/GetThreadDetailUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHendler = this.getThreadDetailHendler.bind(this);
  }

  async postThreadHandler(request, h) {
    const useCasePayload = {
      title: request.payload.title,
      body: request.payload.body,
      owner: request.auth.credentials.id,
    };
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailHendler(request, h) {
    const getDetailThreadUseCase = this._container.getInstance(getThreadDetailHendler.name);
    const { threadId } = request.params;
    const thread = await getDetailThreadUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: { thread },
    });

    return response;
  }
}

module.exports = ThreadsHandler;
