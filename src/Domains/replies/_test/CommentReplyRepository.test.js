const CommentReplyRepository = require('../CommentReplyRepository');

describe('CommentReplyRepository interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    const commentReplyRepository = new CommentReplyRepository();

    await expect(commentReplyRepository.create('')).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentReplyRepository.getByThreadId('')).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentReplyRepository.validate('')).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentReplyRepository.delete('')).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
