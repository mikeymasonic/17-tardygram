const chance = require('chance').Chance();
const User = require('../lib/models/User');
const Gram = require('../lib/models/Gram');

module.exports = async({ usersToCreate = 5, gramsToCreate = 50 } = {}) => {
  const loggedIn = await User.create({
    username: 'Wootie',
    password: 'tweeds',
    profilePhotoUrl: 'https://placekitten.com/100/100'
  });

  const users = await User.create([...Array(usersToCreate)].slice(1).map(() => ({
    username: chance.email(),
    password: chance.word(),
    profilePhotoUrl: chance.url()
  })));

  await Gram.create([...Array(gramsToCreate)].map(() => ({
    user: chance.weighted([loggedIn, ...users], [2, ...users.map(() => 1)])._id,
    photoUrl: chance.url(),
    caption: chance.sentence(),
    tags: [...Array(10)].map(() => (chance.hashtag()))
  })));
};
