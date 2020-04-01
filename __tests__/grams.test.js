const { getUser, getAgent, getGrams, getGram } = require('../db/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('grams routes', () => {

  it('create a new gram', async() => {
    const user = await getUser({ username: 'Wootie' });
    return getAgent()
      .post('/api/v1/grams')
      .send({
        photoUrl: 'http://placekitten.com/200/200',
        caption: 'I\'m like a birb',
        tags: ['#birblife', '#iwunttweeds']
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          user: user._id,
          photoUrl: 'http://placekitten.com/200/200',
          caption: 'I\'m like a birb',
          tags: ['#birblife', '#iwunttweeds'],
          __v: 0
        });
      });
  });

  it('gets all grams', async() => {
    const grams = await getGrams();
    return request(app)
      .get('/api/v1/grams')
      .then(res => {
        expect(res.body).toEqual(grams);
      });
  });

  it('gets a gram by id', async() => {
    const user = await getUser({ username: 'Wootie' });
    const gram = await getGram({ user: user._id });
    return getAgent()
      .get(`/api/v1/grams/${gram._id}`)
      .then(res => {
        expect(res.body).toEqual({ ...gram, user: user });
      });
  });


  it('updates a grams caption', async() => {
    const user = await getUser({ username: 'Wootie' });
    const gram = await getGram({ user: user._id });
    return getAgent()
      .patch(`/api/v1/grams/${gram._id}`)
      .send({ caption: 'nooo' })
      .then(res => {
        expect(res.body).toEqual({ ...gram, caption: 'nooo' });
      });
  });

  it('deletes a gram', async() => {
    const user = await getUser({ username: 'Wootie' });
    const gram = await getGram({ user: user._id });
    return getAgent()
      .delete(`/api/v1/grams/${gram._id}`)
      .then(res => {
        expect(res.body).toEqual(gram);
      });
  });

});
