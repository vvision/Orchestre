var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Artist = mongoose.model('Artist');
var Album = mongoose.model('Album');

router.get('/', artists);
router.get('/:id', aboutArtist);
router.get('/:id/albums', albumsFromArtist);

module.exports = router;

//TODO: Pagination
function artists(req, res, next) {
  var start = req.query.start;
  var limit = req.query.limit;

  Artist.find(function (err, docs) {
    if(err) console.error(err);
    console.log(docs);
    res.send(docs);
  });
}


function aboutArtist(req, res, next) {
  var id = req.params.id;

  Artist.findById(id, {'_id': 0}, function (err, artist) {
    if(err) {
      var error = new Error('Error trying to find this artist. Check your id.');
      error.status = 500;
      return next(error);
    }
    res.send(artist);
  });
}


function albumsFromArtist(req, res, next) {
  var id = req.params.id;

  Artist.findById(id, {'_id': 0}, function (err, artist) {
    if(err) {
      var error = new Error('Error trying to find this artist. Check your id.');
      error.status = 500;
      return next(error);
    }

    //TODO: Would be easier to search if artist id present in a album object and not artist name String
    Album.find({artist: artist.name}).sort('name').exec(function(err, albums) {
      if(err) {
        var error = new Error('Error trying to find albums for this artist. Check your id.');
        error.status = 500;
        return next(error);
      }
      res.send(albums);
    });

  });
}
