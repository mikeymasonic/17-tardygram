const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photoUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    require
  }]
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  }
});

schema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post'
});

schema.statics.mostComments = function() {
  return this
    .aggregate([
      {
        '$lookup': {
          'from': 'comments', 
          'localField': '_id', 
          'foreignField': 'post', 
          'as': 'comments'
        }
      }, {
        '$project': {
          '_id': true, 
          'user': true, 
          'photoUrl': true, 
          'caption': true, 
          'numComments': {
            '$size': '$comments'
          }
        }
      }, {
        '$sort': {
          'numComments': -1
        }
      }, {
        '$limit': 10
      }
    ]);
};

module.exports = mongoose.model('Gram', schema);
