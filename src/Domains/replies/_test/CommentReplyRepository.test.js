const CommentReplyRepository = require('../CommentReplyRepository');

describe('CommentReplyRepository interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    const commentReplyRepository = new CommentReplyRepository();

    await expect(commentReplyRepository.addNewCommentReply('', '', '', '')).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentReplyRepository.deleteCommentReply('', '', '', '')).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentReplyRepository.getCommentReplyById('')).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentReplyRepository.verifyAvailableReply('')).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
