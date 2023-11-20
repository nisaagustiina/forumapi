class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const { owner, threadId, commentId } = payload;

    await this._threadRepository.verifyThread(threadId);
    await this._commentRepository.verifyComment(owner, threadId, commentId);
    return this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
