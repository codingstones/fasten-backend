var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var api = require('../index.js').app;

var data = {'foo': 'bar'};

describe('Projects API', () => {
  context('GET /projects', () => {
    it('respond with json', (done) => {
      request(api)
        .get('/projects')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  context('POST /projects', () => {
    it('stores a json', (done) =>{
      request(api)
        .post('/projects')
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

  context('GET /projects/:id', () =>{
    it('respond with json', (done) => {
      request(api)
        .get('/projects/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    });
  });

  context('PUT /projects/:id', () =>{
    var updatedData = {id: 1, 'cereal': 'panizo'};

    it('updates the json', (done) => {
      request(api)
        .put('/projects/'+updatedData.id)
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

  context('DELETE /projects/:id', () =>{
    it('deletes the project', (done) => {
      request(api)
        .get('/projects')
        .send(data)
        .end((err, res) => {
          if (err) throw err;
          var lastProject = res.body[res.body.length-1];
          request(api)
            .delete('/projects/'+lastProject.id)
            .expect(204, done);
        });
    });
  });
});