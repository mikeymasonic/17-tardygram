require('../db/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('users routes', () => {

  it('gets the 10 users with the most total comments on their posts', async() => {
    return request(app)
      .get('/api/v1/users/popular')
      .then(res => {
        expect(res.body).toHaveLength(10);
        expect(res.body).toContainEqual({
          _id: expect.any(String),
          username: expect.any(String),
          totalComments: expect.any(Number)
        });
      });
  });

  it('gets the 10 users with the most grams', async() => {
    return request(app)
      .get('/api/v1/users/prolific')
      .then(res => {
        expect(res.body).toHaveLength(10);
        expect(res.body).toContainEqual({
          _id: expect.any(String),
          username: expect.any(String),
          totalGrams: expect.any(Number)
        });
      });
  });

  it('gets the 10 users with the most total comments', async() => {
    return request(app)
      .get('/api/v1/users/leader')
      .then(res => {
        expect(res.body).toHaveLength(10);
        expect(res.body).toContainEqual({
          _id: expect.any(String),
          username: expect.any(String),
          totalCommentsWritten: expect.any(Number)
        });
      });
  });
  
});
