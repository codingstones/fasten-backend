var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var api = require('../index.js').app;

var data = {'foo': 'bar'};

describe('Iterations API', () => {
  context('GET /iterations', () => {
    it('respond with json', (done) => {
      request(api)
        .get('/iterations')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  context('POST /iterations', () => {
    it('stores a json', (done) =>{
      request(api)
        .post('/iterations')
        .send(data)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).to.deep.equal(data);
          done();
        });
    });
  });

  context('GET /iterations/:id', () =>{
    it('respond with json', (done) => {
      request(api)
        .get('/iterations/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    });
  });

  context('PUT /iterations/:id', () =>{
    var updatedData = {id: 1, 'cereal': 'panizo'};

    it('updates the json', (done) => {
      request(api)
        .put('/iterations/'+updatedData.id)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).to.deep.equal(updatedData);
          done();
        });
    });
  });

  context('DELETE /iterations/:id', () =>{
    it('deletes the iteration', (done) => {
      request(api)
        .get('/iterations')
        .send(data)
        .end((err, res) => {
          if (err) throw err;
          var lastIteration = res.body[res.body.length-1];
          request(api)
            .delete('/iterations/'+lastIteration.id)
            .expect(204, done);
        });
    });
  });
});