var pg = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/fasten'
//pg.defaults.ssl = true;
pg.connect(DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres!');

  client
    .query('SELECT id, body FROM iterations;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});