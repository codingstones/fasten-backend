var pg = require('pg');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/fasten'
if (process.env.DATABASE_URL){
  pg.defaults.ssl = true;
}

app.get('/projects', function(req, res) {
  pg.connect(DATABASE_URL, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    const projects = [];
    const query = client.query('SELECT id, body FROM iterations order by id');
    
    query.on('row', function(row) {
      var project = row['body'];
      project.id = row['id'];
      projects.push(project);
    });

    query.on('end', () => {
      done()
      return res.json(projects);
    });
  });
});

app.get('/projects/:id', (req, res) => {
  pg.connect(DATABASE_URL, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    const id = parseInt(req.params.id)
    var project;
    const query = client.query('SELECT id, body FROM iterations where id = $1', [id]);
    query.on('row', function(row) {
      project = row['body'];
      project.id = row['id'];
    });
    query.on('end', () => {
      done()
      return res.json(project);
    });
  });
});

app.post('/projects', (req, res) => {
  pg.connect(DATABASE_URL, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    const data = req.body;
    const query = client.query('INSERT INTO iterations (body) values ($1)', [data]);
    query.on('end', () => {
      done();
      return res.status(201).json(data);
    });
  });
});

app.put('/projects/:id', (req, res) => {
  pg.connect(DATABASE_URL, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    const id = parseInt(req.params.id)

    var data = req.body;
    data.id = id;
    const query = client.query('UPDATE iterations set body = $1 where id = $2', [data, id]);
    query.on('end', () => {
      done();
      return res.json(data);
    });
  });
});

app.delete('/projects/:id', (req, res) => {
  pg.connect(DATABASE_URL, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    const id = parseInt(req.params.id)

    const query = client.query('DELETE FROM iterations WHERE id = $1', [id]);
    query.on('end', (result) => {
      done();
      return res.status(204).send();
    });
  });
});

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

exports.app = app;