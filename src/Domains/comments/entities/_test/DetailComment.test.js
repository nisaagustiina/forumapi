const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      date: new Date(),
      content: 'Content comment',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 12345,
      username: 'dicoding',
      date: new Date(),
      content: 'Content comment',
      isDelete: false,
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'Content comment',
      isDelete: false,
    };

    // Action
    const {
      id, username, date, content,
    } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });

  it('should create DetailComment(Deleted) object correctl', () => {
    // Arrange
    const messageDelete = '**komentar telah dihapus**';
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'Content comment',
      isDelete: true,
    };

    // Action
    const {
      id, username, date, content,
    } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(messageDelete);
  });
});
