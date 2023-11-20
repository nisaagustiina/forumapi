class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const messageDelete = '**komentar telah dihapus**';
    const {
      id, username, date, content, isDelete,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = (isDelete) ? messageDelete : content;
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, isDelete,
    } = payload;

    if (!id || !username || !date || !content || isDelete === undefined) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'object'
    || typeof content !== 'string' || typeof isDelete !== 'boolean') {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
