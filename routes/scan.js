var express = require('express');
var router = express.Router();
var conf = require('../config');
var scanning = require('./utils/scanMusicDir');
var auth = require('./utils/checkAuth');

router.get('/', auth.ensureAuthenticated, auth.ensureAdmin, scan);

module.exports = router;

function scan(req, res) {
  scanning.scanDir(conf.musicPath, conf.extensions, function(err) {
    console.log('ALL DIRECTORIES SCANNED!');
    var resp = {};
    if (err) {
      resp.status = 'Internal Server Error';
      resp.message = 'An error occurred!';
      res.status(500).send(resp);
    } else {
      resp.status = 200;
      resp.message = 'Database populated!';
      res.send(resp);
    }
  });
}
