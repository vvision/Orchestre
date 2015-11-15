var fs = require('fs');
var path = require('path');
var async = require('async');
var musicmetadata = require('musicmetadata');
var _ = require('underscore');
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
    {
      upsert: true,
      new: true
    },
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
    {
      upsert: true,
      new: true
    },
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
    {
      upsert: true,
      new: true
    },
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
    {
      upsert: true,
      new: true
    },
    function(err, doc) {
      if(err) {
        console.log(err);
      }
      console.log(doc);
      cb(doc);
    });
};

var compareDirWithDB = function(path, allowedExtension, callback) {
  readDir(path, function(err, songsInDir) {
    if(err) {
      console.error(err);
    }
    songsInDir = songsInDir.files;
    //console.log(songsInDir);
    Song.find().select('dir fileName').exec(function (err, songsInDB) {
      if(err) {
        console.error(err);
      }
      console.log(songsInDB);

      var knownSongs = _.map(songsInDB, function(song) {
        return song.dir + '/' + song.fileName;
      });
      console.log('known');
      console.log(knownSongs);
      //console.log('DIR');
      //console.log(songsInDir);

      var songsToImport = _.difference(songsInDir, knownSongs);
      var songsToRemove = _.difference(knownSongs, songsInDir);
      console.log('IMPORT');
      console.log(songsToImport);
      console.log('REMOVE');
      console.log(songsToRemove);

      saveSongs(songsToImport, allowedExtension, function() {
        removeSongs(songsToRemove, function() {
          callback();
        });
      });
    });
  });
};

//TODO: Remove album and artist picture too!!
var removeSongs = function(songs, callback) {
  async.eachSeries(songs, function (song, cb) {
    var path = song.split('/');
    var filename = path[path.length - 1];

    Song.findOne({fileName: filename}, function(err, songToRemove) {
      if(err) {
        console.log(err);
      }
      console.log(songToRemove);

      Song.remove({fileName: filename}, function(err) {
        if(err) {
          console.log(err);
        }

        //Check if there are songs left in the album else remove it
        Song.count({album: songToRemove.album}, function(err, nSongsLeftInAlbum) {
          if(err) {
            console.log(err);
          }
          if(nSongsLeftInAlbum === 0) {
            Album.findOneAndRemove({name: songToRemove.album, artist: songToRemove.artist}, function(err, album) {
              if(err) {
                console.log(err);
              }
              //Remove album picture
              fs.unlink('./public/img/albums/' + album._id + '.jpg', function(err) {
                if(err) {
                  console.log(err);
                }
              });
            });
          }
        });

        //Check if there are songs left for the artist else remove it
        Song.count({artist: songToRemove.artist}, function(err, nSongsLeftForArtist) {
          if(err) {
            console.log(err);
          }
          if(nSongsLeftForArtist === 0) {
            Artist.findOneAndRemove({name: songToRemove.artist}, function(err, artist) {
              if(err) {
                console.log(err);
              }
              //Remove artist picture
              fs.unlink('./public/img/artists/' + artist._id + '.jpg', function(err) {
                if(err) {
                  console.log(err);
                }
              });
            });
          }
        });

        cb();
      });

    });
  }, function (err) {
    if(err) {
      console.error(err);
    }
    callback(err);
  });
};

var readDir = function(start, callback) {
  // Use lstat to resolve symlink if we are passed a symlink
  fs.lstat(start, function(err, stat) {
    if(err) {
      return callback(err);
    }
    var found = {files: []};
    var total = 0;
    var processed = 0;
    function isDir(abspath) {
      fs.stat(abspath, function(err, stat) {
        if(stat.isDirectory()) {
          // If we found a directory, recurse!
          readDir(abspath, function(err, data) {
            found.files = found.files.concat(data.files);
            if(++processed === total) {
              callback(null, found);
            }
          });
        } else {
          found.files.push(abspath);
          if(++processed === total) {
            callback(null, found);
          }
        }
      });
    }
    // Read through all the files in this directory
    if(stat.isDirectory()) {
      fs.readdir(start, function (err, files) {
        total = files.length;
        if (total === 0) {
          callback(null, found);
        }
        for(var x=0, l=files.length; x<l; x++) {
          isDir(path.join(start, files[x]));
        }
      });
    } else {
      return callback(new Error('path: ' + start + ' is not a directory'));
    }
  });
};

var saveSongs = function (data, allowedExtension, callback) {
  //readDir(path, function (err, data) {
  //  if(err) {
  //    console.error(err);
  //  }
  async.eachSeries(data, function (el, cb) {
    var path = el.split('/');
    var filename = path.pop();
    var temp = filename.split('.');
    var extension = temp.pop().toLowerCase();

    //Check if extension is allowed. Ignore hidden files.
    if(allowedExtension.indexOf(extension) !== -1 && el.charAt(0) !== '.') {

      //Get metadata from the file
      //console.log(path + el);
      //Set duration to false to prevent reading the entire file.
      musicmetadata(fs.createReadStream(el), {duration: false}, function (err, metadata) {
        if(err) {
          console.error(err);
          cb();
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
          fileName: filename,
          title: metadata.title,
          dir: path.join('/'),
          artist: metadata.artist[0],
          album: metadata.album,
          genre: metadata.genre,
          rate: 0,
          trackNumber: metadata.track.no,
          type: extension
        });

        upsertArtist(artist, function() {
          upsertGenre(genre, function() {
            upsertAlbum(album, function(doc) {
              song.albumId = doc._id;
              upsertSong(song, function() {
                cb();
              });
            });
          });
        });
      });

    } else {
      //Not music -> process next file
      cb();
    }
  }, function (err) {
    if(err) {
      console.error(err);
    }
    callback(err);
  });
  //});
};

module.exports.scanDir = compareDirWithDB;
