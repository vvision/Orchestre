var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Album = mongoose.model('Album');
var Song = mongoose.model('Song');

router.get('/', albums);
router.get('/:id', aboutAlbum);
router.get('/:id/songs', songsFromAlbum);

module.exports = router;

//TODO: Pagination
function albums (req, res) {
  var start = req.query.start;
  var limit = req.query.limit;

  Album.find(function (err, docs) {
    if(err) console.error(err);
    console.log(docs);
    res.send(docs);
  });
}


function aboutAlbum(req, res, next) {
  var id = req.params.id;
  console.log(id);

  Album.findById(id, {'_id': 0}, function(err, album) {
    if(err) {
      var error = new Error('Error trying to find this album. Check your id.');
      error.status = 500;
      return next(error);
    }
    res.send(album);
  });
}


function songsFromAlbum(req, res, next) {
  var id = req.params.id;

  Album.findById(id, {'_id': 0}, function(err, album) {
    if(err) {
      var error = new Error('Error trying to find this album. Check your id.');
      error.status = 500;
      return next(error);
    }

    //TODO: Would be easier to search if album id present in a song object and not title String
    Song.find({album: album.name}, {'dir': 0, '__v': 0, 'fileName': 0}).sort('trackNumber').exec(function(err, songs) {
      if(err) {
        var error = new Error('Error trying to find song for this album.');
        error.status = 500;
        return next(error);
      }
      res.send(songs);
    });
  });
}
