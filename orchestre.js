var express = require('express');
var app = express();
var fs = require('fs');

var db = require('./models/db');
var mongoose = require('mongoose');
var Song = mongoose.model('Song');

var search = require('./routes/search');
var songs = require('./routes/songs');
var artists = require('./routes/artists');
var albums = require('./routes/albums');
var users = require('./routes/users');
var auth = require('./routes/auth');
var scan = require('./routes/scan');

var conf = require('./config');

app.use(require('morgan')());
app.use(require('body-parser')());
app.use(require('cookie-parser')());
app.use(require('cookie-session')({
  secret: 'ASYDctgfeDKFLS646',
  cookie: {
    maxAge: 60 * 60 * 1000
  }
}));

app.use('/search', search);
app.use('/songs', songs);
app.use('/artists', artists);
app.use('/albums', albums);
app.use('/users', users);
app.use('/auth', auth);
app.use('/scan', scan);

//TODO: Add nb of Artist, Albums and Genres
app.get('/stats', function(req, res) {
  Song.count(function(err, nSongs) {
    if(err) {
      console.log(err);
    }
    console.log(nSongs);
    res.send({songs: nSongs});
  });
});

//Error Handler
app.use(function(err, req, res, next) {
  switch(err.status) {
    case 401:
      res.status(401).send({
        status: 'Unauthorized',
        err: err.message || 'Please sign in.',
        requestId: ''
      });
      break;

    case 403:
      res.status(403).send({
        status: 'Forbidden',
        err: err.message || 'You do not have the required permission to perform this action.',
        requestId: ''
      });
      break;

    case 500:
      res.status(500).send({
        status: 'Internal Server Error',
        err: err.message || 'Unspecified Error',
        requestId: ''
      });
      break;

    default:
      return next();
  }

});

//Express End of use definition
app.use(express.static('./public'));
app.use(function(req, res) {
  fs.createReadStream('./public/index.html').pipe(res);
});

app.listen(conf.port, conf.host, function() {
  console.log('Server running on port ' + conf.port);
});
