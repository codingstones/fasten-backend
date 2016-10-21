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

app.get('/iterations', function(req, res) {
  pg.connect(DATABASE_URL, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    const iterations = [];
    const query = client.query('SELECT id, body FROM iterations order by id');
    
    query.on('row', function(row) {
      var iteration = row['body'];
      iteration.id = row['id'];
      iterations.push(iteration);
    });

    query.on('end', () => {
      done()
      return res.json(iterations);
    });
  });
});

app.get('/iterations/:id', (req, res) => {
  pg.connect(DATABASE_URL, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    const id = parseInt(req.params.id)

    const query = client.query('SELECT id, body FROM iterations where id = $1', [id]);
    query.on('end', (iteration) => {
      done()
      return res.json(iteration);
    });
  });
});

app.post('/iterations', (req, res) => {
  pg.connect(DATABASE_URL, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    const data = req.body;
    const query = client.query('INSERT INTO iterations (body) values ($1)', [data]);
    query.on('end', (result) => {
      done();
      return res.status(201).json(data);
    });
  });
});


app.put('/iterations/:id', (req, res) => {
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
    query.on('end', (result) => {
      done();
      return res.json(data);
    });
  });
});

app.delete('/iterations/:id', (req, res) => {
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