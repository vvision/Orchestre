var fs = require('fs');
var async = require('async');
var taglib = require('taglib');
var mongoose = require('mongoose');
var Song = mongoose.model('Song');
var Artist = mongoose.model('Artist');
var Album = mongoose.model('Album');
var Genre = mongoose.model('Genre');

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
          var tag = taglib.tagSync(path + el);
          console.log(tag);
          //Insert in DB
          var artist = new Artist({
            name: tag.artist
          });
          var genre = new Genre({
            name: tag.genre
          });
          var album = new Album({
            name: tag.album,
            year: 0,
            artist: tag.artist
          });
          var song = new Song({
            fileName: el,
            title: tag.title,
            dir: path,
            artist: tag.artist,
            album: tag.album,
            genre: tag.genre,
            rate: 0,
            trackNumber: tag.track
          });

          insert(artist, Artist, function() {
            insert(genre, Genre, function() {
              insert(album, Album, function() {
                insert(song, Song, function() {
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

//Assuming db is empty
function insert(el, model, cb) {
  var db = mongoose.connection;
  var name = el.name;
  console.log(el);
  if(el.name) {
    el = el.toObject();
    delete el._id;
    model.findOneAndUpdate({name: name}, el, {upsert: true}, function(err, doc) {
      if(err) {
        console.log(err);
      }
      //console.log('RAW');
      console.log(doc);
      cb(doc);
    });
  } else {
    //It's a song so just save it
    console.log('Save Song');
    el.save(function (err, data) {
        if (err) {
          console.log(err);
        }
      console.log(data);
      cb(data);
    });
  }
}


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
