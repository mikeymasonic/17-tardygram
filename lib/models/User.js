const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Path `username` is required.'],
    unique: [true, 'username already exists']
  },
  passwordHash: {
    type: String,
    required: true
  },
  profilePhotoUrl: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash;
    }
  }
});

schema.virtual('password').set(function(password) {
  const hash = bcrypt.hashSync(password, 8);
  this.passwordHash = hash;
});

schema.statics.authorize = async function({ username, password }) {
  const user = await this.findOne({ username });
  if(!user) {
    const error = new Error('Invalid username/password');
    error.status = 401;
    throw error;
  }
  const matchingPassword = await bcrypt.compare(password, user.passwordHash);
  if(!matchingPassword) {
    const error = new Error('Invalid username/password');
    error.status = 401;
    throw error;
  }
  return user;
};

schema.statics.findByToken = function(token) {
  try {
    const { payload } = jwt.verify(token, process.env.APP_SECRET);
    return Promise.resolve(this.hydrate(payload));
  } catch(e) {
    return Promise.reject(e);
  }
};

schema.methods.authToken = function() {
  const token = jwt.sign({ payload: this.toJSON() }, process.env.APP_SECRET, { expiresIn: '24h' });
  return token;
};

schema.statics.topTotalComments = function() {
  return this
    .aggregate([
      {
        '$lookup': {
          'from': 'grams', 
          'localField': '_id', 
          'foreignField': 'user', 
          'as': 'grams'
        }
      }, {
        '$lookup': {
          'from': 'comments', 
          'localField': 'grams._id', 
          'foreignField': 'post', 
          'as': 'comments'
        }
      }, {
        '$project': {
          '_id': true, 
          'username': true, 
          'totalComments': {
            '$size': '$comments'
          }
        }
      }, {
        '$sort': {
          'totalComments': -1
        }
      }, {
        '$limit': 10
      }
    ]);
};

module.exports = mongoose.model('User', schema);
