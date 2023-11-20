class DetailThreadUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const threadId = payload;

    const thread = await this._threadRepository.detailThread(threadId);
    const comments = await this._commentRepository.detailComments(threadId);

    thread.comments = comments;

    return thread;
  }
}

module.exports = DetailThreadUseCase;
