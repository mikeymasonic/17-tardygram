const { getUser, getUsers, getAgent, getGrams, getGram, getComments } = require('../db/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('grams routes', () => {

  it('create a new gram', async() => {
    const user = await getUser({ username: 'Wootie' });
    return getAgent()
      .post('/api/v1/grams')
      .send({
        photoUrl: 'https://www.placekitten.com/200/200',
        caption: 'I\'m like a birb',
        tags: ['#birblife', '#iwunttweeds']
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          user: user._id,
          photoUrl: 'https://www.placekitten.com/200/200',
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
    const comments = await getComments({ post: gram._id });
    const commenters = await getUsers();
    comments.forEach(comment => {
      commenters.forEach(commenter => {
        if(comment.commentBy === commenter._id) comment.commentBy = commenter;
      });
    });
    return getAgent()
      .get(`/api/v1/grams/${gram._id}`)
      .then(res => {
        expect(res.body).toEqual({ ...gram, user: user, comments });
      });
  });

  it('updates a grams caption if trying to update a caption', async() => {
    const user = await getUser({ username: 'Wootie' });
    const gram = await getGram({ user: user._id });
    return getAgent()
      .patch(`/api/v1/grams/${gram._id}`)
      .send({ caption: 'nooo' })
      .then(res => {
        expect(res.body).toEqual({ ...gram, caption: 'nooo' });
      });
  });

  it('throws an error if trying to update anything other than a caption', async() => {
    const user = await getUser({ username: 'Wootie' });
    const gram = await getGram({ user: user._id });
    return getAgent()
      .patch(`/api/v1/grams/${gram._id}`)
      .send({ photoUrl: 'https://www.placekitten.com/200/200' })
      .then(res => {
        expect(res.body).toEqual({      
          'message': 'Can only update captions',
          'status': 500 });
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
