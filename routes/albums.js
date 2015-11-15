var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Album = mongoose.model('Album');
var Song = mongoose.model('Song');

var fs = require('fs');
var async = require('async');
var musicmetadata = require('musicmetadata');
var auth = require('./utils/checkAuth');


router.get('/', albums);
router.get('/scan', auth.ensureAuthenticated, auth.ensureAdmin, importPicture);
router.get('/:id', aboutAlbum);
router.get('/:id/songs', songsFromAlbum);


module.exports = router;

//TODO: Pagination
function albums (req, res) {

  Album.find(function (err, docs) {
    if(err) {
      console.error(err);
    }
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

function importPicture(req, res) {
  Album.find(function (err, albums) {
    if(err) {
      console.error(err);
    }

    async.eachSeries(albums, function (album, cb) {
      //console.log(album);
      Song.findOne({albumId: album._id}).exec(function(err, song) {
        console.log(song.title);
        musicmetadata(fs.createReadStream(song.dir + '/' + song.fileName), { duration: false }, function (err, metadata) {
          if(err) {
            console.error(err);
            cb();
          }
          console.log(metadata);
          var picture = metadata.picture[0];
          var id = song.albumId;

          if(picture) {
            var path = './public/img/albums/' + id + '.' + picture.format;
            fs.exists(path, function(exists) {
              if (!exists) {
                fs.writeFile(path, picture.data, function (err) {
                  if (err) {
                    console.log(err);
                  }
                  cb();
                  console.log('It\'s saved!');
                });
              } else {
                console.log('Picture already exists for album:' + album.name);
                cb();
              }
            });
          } else {
            console.log('No picture available for album:' + album.name);
            cb();
          }
        });

      });
    }, function (err) {
      if(err) {
        console.error(err);
      }
      res.send('OK');
    });
  });
}
