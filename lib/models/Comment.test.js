const mongoose = require('mongoose');
const Comment = require('../models/Comment.js');

describe('Comment model tests', () => {
  it('should have a required userId', () => {
    const comment = new Comment();
    const { errors } = comment.validateSync();
    expect(errors.userId.message).toEqual('Path `userId` is required.');
  });

  it('should have a required postId', () => {
    const comment = new Comment();
    const { errors } = comment.validateSync();
    expect(errors.postId.message).toEqual('Path `postId` is required.');
  });

  it('should have a required comment field', () => {
    const comment = new Comment();
    const { errors } = comment.validateSync();
    expect(errors.comment.message).toEqual('Path `comment` is required.');
  });

  it('should be able to make a new Comment', () => {
    const comment = new Comment({
      userId: new mongoose.Types.ObjectId,
      postId: new mongoose.Types.ObjectId,
      comment: 'Is anyone out there?'
    });
    expect(comment.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      userId: expect.any(mongoose.Types.ObjectId),
      postId: expect.any(mongoose.Types.ObjectId),
      comment: 'Is anyone out there?'
    });
  });
});
