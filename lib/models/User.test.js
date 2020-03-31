const User = require('../models/User.js');
const mongoose = require('mongoose');

describe('User model tests', () => {
  it('has a required username', () => {
    const user = new User();
    const { errors } = user.validateSync();
    expect(errors.username.message).toEqual('Path `username` is required.');
  });

  it('has a passwordHash', () => {
    const user = new User();
    const { errors } = user.validateSync();
    expect(errors.passwordHash.message).toEqual('Path `passwordHash` is required.');
  });
});
