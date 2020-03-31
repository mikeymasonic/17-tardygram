const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
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
  tags: {
    type: [{ type: String, validate: {
      validator: function(tag) {
        return tag.startsWith('#');
      },
      message: 'Path `tag` does not begin with a `#` symbol.'
    } }],
    required: true,
    validate: {
      validator: function(tags) {
        return tags.length > 0;
      },
      message: 'Path `tags` is less than the minimum required value (1).'
    }
  }
});

module.exports = mongoose.model('Post', schema);
