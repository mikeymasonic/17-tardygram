const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .get('/popular', (req, res, next) => {
    User
      .topTotalComments()
      .then(users => res.send(users))
      .catch(next);
  });
