class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { owner, threadId, content } = payload;

    this.owner = owner;
    this.threadId = threadId;
    this.content = content;
  }

  _verifyPayload(payload) {
    const { owner, threadId, content } = payload;

    if (!owner || !threadId || !content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof threadId !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
