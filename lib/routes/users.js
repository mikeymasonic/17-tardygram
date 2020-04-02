const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .get('/popular', (req, res, next) => {
    User
      .topTotalComments()
      .then(users => res.send(users))
      .catch(next);
  })
  .get('/prolific', (req, res, next) => {
    User
      .topTotalGrams()
      .then(users => res.send(users))
      .catch(next);
  })
  .get('/leader', (req, res, next) => {
    User
      .topTotalCommentsWritten()
      .then(users => res.send(users))
      .catch(next);
  });
