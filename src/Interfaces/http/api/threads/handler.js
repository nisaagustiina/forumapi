/* istanbul ignore file */
const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase');
const DetailThreadUseCase = require('../../../../Applications/use_case/threads/DetailThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/comments/DeleteCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.addThreadHandler = this.addThreadHandler.bind(this);
    this.detailThreadByIdHandler = this.detailThreadByIdHandler.bind(this);
    this.addCommentHandler = this.addCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async addThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { title, body } = request.payload;

    const addThreadPayload = { owner, title, body };

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(addThreadPayload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async detailThreadByIdHandler(request, h) {
    const { threadId } = request.params;

    const detailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
    const thread = await detailThreadUseCase.execute(threadId);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }

  async addCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const { content } = request.payload;

    const addCommentPayload = { owner, threadId, content };

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(addCommentPayload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const deleteCommentPayload = { owner, threadId, commentId };

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(deleteCommentPayload);

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadsHandler;
