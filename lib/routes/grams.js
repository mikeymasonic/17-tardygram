const { Router } = require('express');
const Gram = require('../models/Gram');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Gram
      .create({ ...req.body, user: req.user._id })
      .then(gram => res.send(gram))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Gram
      .find()
      .then(grams => res.send(grams))
      .catch(next);
  })
  .get('/:id', ensureAuth, (req, res, next) => {
    Gram
      .findOne({
        _id: req.params.id,
        user: req.user._id
      })
      .populate('user')
      .then(gram => res.send(gram))
      .catch(next);
  })
  .patch('/:id', ensureAuth, (req, res, next) => {
    Gram
      .findOneAndUpdate({
        _id: req.params.id,
        user: req.user._id
      }, req.body, { new: true })
      .then(gram => res.send(gram))
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    Gram
      .findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      })
      .then(gram => res.send(gram))
      .catch(next);
  });
