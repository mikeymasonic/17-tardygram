const { getUser, getAgent } = require('../db/data-helpers');
const request = require('supertest');
const app = require('../lib/app');

describe('auth routes', () => {

  it('signup user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'Dink',
        password: 'admin',
        profilePhotoUrl: 'https://placekitten.com/100/100'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'Dink',
          profilePhotoUrl: 'https://placekitten.com/100/100',
          __v: 0
        });
      });
  });

  it('login user', async() => {
    const user = await getUser({ username: 'Wootie' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        username: user.username,
        password: 'tweeds'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: user.username,
          profilePhotoUrl: user.profilePhotoUrl,
          __v: 0
        });
      });
  });

  it('verifies a user', async() => {
    return getAgent()
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'Wootie',
          profilePhotoUrl: 'https://placekitten.com/100/100',
          __v: 0
        });
      });
  });

});
