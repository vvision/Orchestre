var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var async = require('async');
var auth = require('./utils/checkAuth');
var paginate = require('./utils/paginate');
var mongoose = require('mongoose');
var Artist = mongoose.model('Artist');
var Album = mongoose.model('Album');

var conf = require('../config');

router.get('/', artists);
router.get('/importDesc', auth.ensureAuthenticated, auth.ensureAdmin, importWikipediaDesc);
router.get('/importThumb', auth.ensureAuthenticated, auth.ensureAdmin, importWikipediaThumb);
router.get('/:id', aboutArtist);
router.get('/:id/albums', albumsFromArtist);

module.exports = router;

//TODO: Pagination
function artists(req, res) {
  var query = req.query.q || '';
  var currentPage = parseInt(req.query.page) || 1;
  var size = parseInt(req.query.size) || 50;
  var skipFrom = (currentPage * size) - size;
  console.log(req.query);

  Artist.count({name: { '$regex': query, '$options': 'i' }}, function(err, nElements) {
    if(err) {
      console.log(err);
    }

    //Total number of pages in header
    var lastPage = Math.ceil(nElements / size);
    res.append('X-Total-Count', lastPage);

    paginate(currentPage, nElements, 'artists', query, '', size, req.protocol, function(links) {
      console.log(links);
      res.links(links);

      //Find artists matching the query
      Artist.find({name: { '$regex': query, '$options': 'i' }}, {'__v': 0}).sort('name').skip(skipFrom).limit(size).exec(function (err, docs) {
        console.log(docs);
        if(err) {
          console.error(err);
        }
        res.send(docs);
      });
    });
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

function importWikipediaDesc(req, res) {
  var options = {
    uri: 'http://en.wikipedia.org/w/api.php',
    qs: {
      action: 'query',
      prop: 'extracts',
      rawcontinue: '',
      format: 'json',
      indexpageids: 1,
      redirects: 1,
      exintro: 1
    },
    proxy: conf.proxy
  };

  //Would be great to it in multiple batch (not just one)
  Artist.find(function (err, artists) {
    if(err) {
      console.error(err);
    }
    console.log(artists);

    async.eachSeries(artists, function (artist, cb) {
      options.qs.titles = artist.name;
      request(options, function (error, response, body) {
        if(error) {
          console.error(error);
        }
        //console.log(body);
        var data = JSON.parse(body);
        if(data.query) {
          var id = data.query.pageids[0];
          var description = data.query.pages[id].extract;
          if(description) {
            console.log(description);
            //Update artist in db
            Artist.findOneAndUpdate(
              {name: artist.name},
              {desc: description},
              {upsert: true},
              function(err, doc) {
                if(err) {
                  console.log(err);
                }
                console.log(doc);
                cb();
              });
          } else {
            cb();
          }
        }
      });
    }, function (err) {
      if(err) {
        console.error(err);
      }
      res.send('done');
    });

  });
}


function importWikipediaThumb(req, res) {
  var options = {
    uri: 'http://en.wikipedia.org/w/api.php',
    qs: {
      action: 'query',
      prop: 'pageimages',
      format: 'json',
      indexpageids: 1,
      piprop: 'thumbnail',
      pithumbsize: 250,
      pilimit: 1,
      redirects: 1,
      continue: ''
    },
    proxy: conf.proxy
  };

  //Would be great to it in multiple batch (not just one)
  Artist.find(function (err, artists) {
    if(err) {
      console.error(err);
    }
    console.log(artists);

    async.eachSeries(artists, function (artist, cb) {
      options.qs.titles = artist.name;
      request(options, function (error, response, body) {
        if(error) {
          console.error(error);
        }
        //console.log(body);
        var data = JSON.parse(body);
        if(data.query) {
          var id = data.query.pageids[0];
          var thumbnail = data.query.pages[id].thumbnail;
          if(thumbnail) {
            console.log(thumbnail);
            //Save picture
            request(thumbnail.source, {proxy: conf.proxy})
              .on('error', function(err) {
                console.log(err);
                cb();
              })
              .on('end', function() {
                //Update artist in db
                Artist.findOneAndUpdate(
                  {name: artist.name},
                  {img: true},
                  {upsert: true},
                  function(err, doc) {
                    if(err) {
                      console.log(err);
                    }
                    console.log(doc);
                    cb();
                  });
              })
              .pipe(fs.createWriteStream('./public/img/artists/' + artist._id + '.jpg'));
          } else {
            cb();
          }
        }
      });
    }, function (err) {
      if(err) {
        console.error(err);
      }
      res.send('done');
    });

  });
}
