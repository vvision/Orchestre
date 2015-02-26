var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var mongoose = require('mongoose');
var Song = mongoose.model('Song');
var Artist = mongoose.model('Artist');
var Album = mongoose.model('Album');
var Genre = mongoose.model('Genre');
var conf = require('../config');

router.get('/songs', searchSong);
router.get('/artists', searchArtist);
router.get('/albums', searchAlbum);
router.get('/genres', searchGenre);

module.exports = router;

function paginate(currentPage, totalElements, type, query, field, size, protocol, callback) {
  //Pagination
  var hostname = conf.domain !== '' ? conf.domain : conf.host + ':' + conf.port;
  var uri = protocol + '://' + hostname + '/search/' + type +'?';
  var lastPage =  Math.ceil(totalElements / size);

  //Create query parameters
  var queryParams = {};
  if(query !== '') {
    queryParams.q = query;
  }
  if(field !== '' && field !== 'title') {
    queryParams.field = field;
  }
  if(size !== 50) {
    queryParams.size = size;
  }
  uri += querystring.stringify(queryParams);

  //Create links for header
  var links = {
    first: uri + '&page=1',
    last: uri + '&page=' + lastPage
  };
  if(currentPage > 1 && lastPage > 1) {
    var prevPage = currentPage - 1;
    links.prev = uri + '&page=' + prevPage;
  }
  if(currentPage < lastPage) {
    var nextPage = parseInt(currentPage, 10) + 1;
    links.next = uri + '&page=' + nextPage;
  }

  callback(links);
}

function searchSong(req, res) {
  var query = req.param('q', '');
  var field = req.param('field', 'title');
  var currentPage = req.param('page', 1);
  var size = req.param('size', 50);
  var skipFrom = (currentPage * size) - size;
  var songs = [];
  console.log(req.query);

  //Case insensitive regex with query
  var reg = new RegExp('^' + query, 'i');
  var search = {};
  search[field] = reg;
  console.log(search);
  Song.count(search, function(err, nSongs) {
    if(err) {
      console.log(err);
    }

    var links = paginate(currentPage, nSongs, 'songs', query, field, size, req.protocol, function(links) {
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

function searchArtist(req, res) {
  var query = req.param('q', '');
  var currentPage = req.param('page', 1);
  var size = req.param('size', 50);
  var skipFrom = (currentPage * size) - size;
  console.log(req.query);

  //Case insensitive regex with query
  var reg = new RegExp('^' + query, 'i');
  Artist.count({name: reg}, function(err, nElements) {
    if(err) {
      console.log(err);
    }

    var links = paginate(currentPage, nElements, 'artists', query, '', size, req.protocol, function(links) {
      console.log(links);
      res.links(links);

      //Find artists matching the query
      Artist.find({name: reg}, {'__v': 0}).sort('name').skip(skipFrom).limit(size).exec(function (err, docs) {
        console.log(docs);
        if(err) {
          console.error(err);
        }
        res.send(docs);
      });
    });
  });
}

function searchAlbum(req, res) {
  var query = req.param('q', '');
  var currentPage = req.param('page', 1);
  var size = req.param('size', 50);
  var skipFrom = (currentPage * size) - size;
  console.log(req.query);

  //Case insensitive regex with query
  var reg = new RegExp('^' + query, 'i');
  Album.count({name: reg}, function(err, nElements) {
    if(err) {
      console.log(err);
    }

    var links = paginate(currentPage, nElements, 'albums', query, '', size, req.protocol, function(links) {
      console.log(links);
      res.links(links);

      //Find albums matching the query
      Album.find({name: reg}, {'__v': 0}).sort('name').skip(skipFrom).limit(size).exec(function (err, docs) {
        console.log(docs);
        if(err) {
          console.error(err);
        }
        res.send(docs);
      });
    });
  });
}

function searchGenre(req, res) {
  var query = req.param('q', '');
  var currentPage = req.param('page', 1);
  var size = req.param('size', 50);
  var skipFrom = (currentPage * size) - size;
  console.log(req.query);

  //Case insensitive regex with query
  var reg = new RegExp('^' + query, 'i');
  Genre.count({name: reg}, function(err, nElements) {
    if(err) {
      console.log(err);
    }

    var links = paginate(currentPage, nElements, 'genres', query, '', size, req.protocol, function(links) {
      console.log(links);
      res.links(links);

      //Find genres matching the query
      Genre.find({name: reg}, {'__v': 0}).sort('name').skip(skipFrom).limit(size).exec(function (err, docs) {
        console.log(docs);
        if(err) {
          console.error(err);
        }
        res.send(docs);
      });
    });
  });
}
