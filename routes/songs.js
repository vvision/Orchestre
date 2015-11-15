var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Song = mongoose.model('Song');
var auth = require('./utils/checkAuth');
var paginate = require('./utils/paginate');

router.get('/', songs);
router.get('/:id', aboutSong);
router.get('/:id/about', aboutSong);
router.get('/:id/stream', auth.ensureAuthenticated, streamSong);
router.get('/:id/title', songTitle);
router.get('/:id/artist', songArtist);
router.get('/:id/album', songAlbum);
router.get('/:id/track', trackNumber);
router.get('/:id/genre', songGenre);
router.get('/:id/rate', songRate);
router.get('/:id/download/:title', auth.ensureAuthenticated, streamSong);
router.post('/:id/rate/inc', auth.ensureAuthenticated, incrementRate);//TODO Update rather than POST
router.post('/:id/rate/dec', auth.ensureAuthenticated, decrementRate);//TODO Same here

module.exports = router;


function songs (req, res) {
  var query = req.query.q || '';
  var field = req.query.field || 'title';
  var currentPage = req.query.page || 1;
  var size = req.query.size || 50;
  var skipFrom = (currentPage * size) - size;
  console.log(req.query);

  var search = {};
  search[field] = { '$regex': query, '$options': 'i' };
  console.log(search);
  Song.count(search, function(err, nSongs) {
    if(err) {
      console.log(err);
    }

    paginate(currentPage, nSongs, 'songs', query, field, size, req.protocol, function(links) {
      console.log(links);
      res.links(links);

      //Find songs matching the query
      Song.find(search, {'dir': 0, '__v': 0, 'fileName': 0}).sort('artist album trackNumber').skip(skipFrom).limit(size).exec(function (err, docs) {
        console.log(docs);
        if(err) {
          console.error(err);
        }
        res.send(docs);
      });
    });
  });
}

function aboutSong(req, res) {
  var id = req.params.id;
  console.log(id);

  Song.findById(id, {'dir': 0, '__v': 0, 'fileName': 0 }, function(err, doc) {
    console.log(doc);
    res.send(doc);
  });
}

function streamSong (req, res) {
  var id = req.params.id;
  console.log(id);
  Song.findById(id, function (err, doc) {
    console.log(doc);
    var filepath = doc.dir + '/' + doc.fileName;
    console.log(filepath);
    res.sendFile(filepath);
  });
}

function songTitle(req, res) {
  var id = req.params.id;
  console.log(id);
  Song.findById(id, function (err, doc) {
    console.log(doc);
    var resp = {
      title: doc.title
    };
    res.send(resp);
  });
}

function songArtist(req, res) {
  var id = req.params.id;
  console.log(id);
  Song.findById(id, function (err, doc) {
    var resp = {
      artist: doc.artist
    };
    res.send(resp);
  });
}

function songAlbum(req, res) {
  var id = req.params.id;
  console.log(id);
  Song.findById(id, function (err, doc) {
    var resp = {
      album: doc.album
    };
    res.send(resp);
  });
}

function trackNumber(req, res) {
  var id = req.params.id;
  console.log(id);
  Song.findById(id, function (err, doc) {
    console.log(doc);
    var resp = {
      track: doc.trackNumber
    };
    res.send(resp);
  });
}

function songGenre(req, res) {
  var id = req.params.id;
  console.log(id);
  Song.findById(id, function (err, doc) {
    var resp = {
      genre: doc.genre
    };
    res.send(resp);
  });
}

function songRate(req, res) {
  var id = req.params.id;
  console.log(id);
  Song.findById(id, function (err, doc) {
    var resp = {
      rate: doc.rate
    };
    res.send(resp);
  });
}

/* Increment the rate of a given song
*  TODO: Check which error code to send
*/
function incrementRate(req, res) {
  var id = req.params.id;
  Song.where({_id: id}).findOne(function(err, data) {
    if(err) {
      res.send('Error');
    }
    //console.log(data);

    if(data.rate < 5) {
      Song.findOneAndUpdate({_id: id}, {$inc: {rate: 1}}, function(err) {
        if(err) {
          console.log(err);
        }
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(400);
    }
  });
}

/* Decrement the rate of a given song
*  TODO: Check which error code to send
*/
function decrementRate (req, res) {
  var id = req.params.id;

  Song.where({_id: id}).findOne(function(err, data) {
    if(err) {
      res.send('Error');
    }
    //console.log(data);

    if(data.rate > 0) {
      Song.findOneAndUpdate({_id: id}, {$inc: {rate: -1}}, function(err) {
        if(err) {
          console.log(err);
        }
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(400);
    }
  });
}
