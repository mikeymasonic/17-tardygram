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


schema.statics.topTotalGrams = function() {
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
        '$project': {
          '_id': true, 
          'username': true, 
          'totalGrams': {
            '$size': '$grams'
          }
        }
      }, {
        '$sort': {
          'totalGrams': -1
        }
      }, {
        '$limit': 10
      }
    ]);
};

schema.statics.topTotalCommentsWritten = function() {
  return this
    .aggregate([
      {
        '$lookup': {
          'from': 'comments', 
          'localField': '_id', 
          'foreignField': 'commentBy', 
          'as': 'comments'
        }
      }, {
        '$project': {
          '_id': true, 
          'username': true, 
          'totalCommentsWritten': {
            '$size': '$comments'
          }
        }
      }, {
        '$sort': {
          'totalCommentsWritten': -1
        }
      }, {
        '$limit': 10
      }
    ]);
};

schema.statics.topCommentsPerPost = function() {
  return this.model('Comment')
    .aggregate([
      {
        '$group': {
          '_id': '$post', 
          'commentCount': {
            '$sum': 1
          }
        }
      }, {
        '$lookup': {
          'from': 'grams', 
          'localField': '_id', 
          'foreignField': '_id', 
          'as': 'gram'
        }
      }, {
        '$unwind': {
          'path': '$gram'
        }
      }, {
        '$group': {
          '_id': '$gram.user', 
          'avgCommentsPerPost': {
            '$avg': '$commentCount'
          }
        }
      }, {
        '$sort': {
          'avgCommentsPerPost': -1
        }
      }, {
        '$limit': 10
      }
    ]);
};

module.exports = mongoose.model('User', schema);
