var express = require('express');
var router = express.Router();
var conf = require('../config');
var scanning = require('./utils/scanMusicDir');
var checkAuth = require('./utils/checkAuth');

var mongoose = require('mongoose');
var Song = mongoose.model('Song');
var Artist = mongoose.model('Artist');
var Album = mongoose.model('Album');
var Genre = mongoose.model('Genre');


router.get('/', checkAuth.isAdmin, scan);

module.exports = router;

var removeDatabases = function(callback) {
  Song.remove({}, function() {
    Artist.remove({}, function() {
      Album.remove({}, function() {
        Genre.remove({}, function() {
          callback();
        });
      });
    });
  });
};

function scan(req, res) {
  //Let's drop the DB
  removeDatabases(function() {
    console.log('REMOVED');
    scanning.scanDir(conf.musicPath, conf.extensions, function(err) {
      console.log('ALL DIRECTORIES SCANNED!');
    if (err) {
      throw err;
      var resp = {
        status: 'Internal Server Error',
        message: 'An error occured!'
      };
      res.status(500).send(resp);
    } else {
      var resp = {
        status: 200,
        message: 'Database populated!'
      };
      res.send(resp);
    }
    });
  });
}
