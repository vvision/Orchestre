var fs = require('fs');
var async = require('async');
var musicmetadata = require('musicmetadata');
var mongoose = require('mongoose');
var Song = mongoose.model('Song');
var Artist = mongoose.model('Artist');
var Album = mongoose.model('Album');
var Genre = mongoose.model('Genre');

var upsertSong = function(song, cb) {
  song = song.toObject();
  delete song._id;
  Song.findOneAndUpdate(
    {title: song.title, artist: song.artist},
    song,
    {upsert: true},
    function(err, doc) {
      if(err) {
        console.log(err);
      }
      console.log(doc);
      cb(doc);
  });
};

var upsertAlbum = function(album, cb) {
  album = album.toObject();
  delete album._id;
  Album.findOneAndUpdate(
    {name: album.name},
    album,
    {upsert: true},
    function(err, doc) {
      if(err) {
        console.log(err);
      }
      console.log(doc);
      cb(doc);
  });
};

var upsertArtist = function(artist, cb) {
  artist = artist.toObject();
  delete artist._id;
  Artist.findOneAndUpdate(
    {name: artist.name},
    artist,
    {upsert: true},
    function(err, doc) {
      if(err) {
        console.log(err);
      }
      console.log(doc);
      cb(doc);
  });
};

var upsertGenre = function(genre, cb) {
  genre = genre.toObject();
  delete genre._id;
  Genre.findOneAndUpdate(
    {name: genre.name},
    genre,
    {upsert: true},
    function(err, doc) {
      if(err) {
        console.log(err);
      }
      console.log(doc);
      cb(doc);
  });
};

var scanDir = function (path, allowedExtension, callback) {
  path += '/';
  fs.readdir(path, function (err, data) {
    if(err) {
      console.error(err);
    }
    async.eachSeries(data, function (el, cb) {
      var temp = el.split('.');
      var size = temp.length;
      //Test whether the given element is a directory or a file.
      if(size === 1) {
        //Don't add directory to the array, just reuse scanDir
        var newPath = path + el;
        //Check if it's really a directory and not a file with no extension such as Makefile
        if(fs.lstatSync(newPath).isDirectory()) {
          scanDir(newPath, allowedExtension, function () {
            cb();
          });
        } else {
          cb();
        }
      } else {
        //Check if extension is allowed. For now, flac or mp3. Ignore hidden files.
        if(allowedExtension.indexOf(temp[size - 1].toLowerCase()) !== -1 && el.charAt(0) !== '.') {

          //Get metadata from the file
          //console.log(path + el);
          //Set duration to false to prevent reading the entire file.
          musicmetadata(fs.createReadStream(path + el), { duration: false }, function (err, metadata) {
            if(err) {
              console.error(err);
            }
            console.log(metadata);
            //Insert in DB
            var artist = new Artist({
              name: metadata.artist[0]
            });
            //TODO: Insert all genres (foreach)
            var genre = new Genre({
              name: metadata.genre[0]
            });
            var album = new Album({
              name: metadata.album,
              year: metadata.year,
              artist: metadata.artist[0]
            });
            var song = new Song({
              fileName: el,
              title: metadata.title,
              dir: path,
              artist: metadata.artist[0],
              album: metadata.album,
              genre: metadata.genre,
              rate: 0,
              trackNumber: metadata.track.no
            });

            upsertArtist(artist, function() {
              upsertGenre(genre, function() {
                upsertAlbum(album, function() {
                  upsertSong(song, function() {
                  });
                });
              });
            });
          });

        }
        cb();
      }
    }, function (err) {
      if(err) {
        console.error(err);
      }
      callback(err);
    });
  });
};

function getExtension(path) {
  var fileName = path.split('.');
  var extension = fileName[fileName.length - 1];
  if(extension === 'flac' || extension === 'FLAC'){
    return 1;
  } else if(extension === 'mp3' || extension === 'MP3'){
    return 3;
  } else if(extension === 'mp4' || extension === 'MP4'){
    return 4;
  }
}

module.exports.scanDir = scanDir;
