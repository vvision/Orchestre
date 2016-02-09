var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var mongoose = require('mongoose');
var Song = mongoose.model('Song');
var Artist = mongoose.model('Artist');
var Album = mongoose.model('Album');
var Genre = mongoose.model('Genre');
var conf = require('../config');

router.get('/genres', searchGenre);

module.exports = router;

function paginate(currentPage, totalElements, type, query, field, size, protocol, callback) {
  //Pagination
  var hostname = conf.domain !== '' ? conf.domain : conf.host + ':' + conf.port;
  var uri = protocol + '://' + hostname + '/search/' + type +'?';
  var lastPage = Math.ceil(totalElements / size);

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

function searchGenre(req, res) {
  var query = req.query.q || '';
  var currentPage = parseInt(req.query.page) || 1;
  var size = parseInt(req.query.size) || 50;
  var skipFrom = (currentPage * size) - size;
  console.log(req.query);

  Genre.count({name: { '$regex': query, '$options': 'i' }}, function(err, nElements) {
    if(err) {
      console.log(err);
    }

    paginate(currentPage, nElements, 'genres', query, '', size, req.protocol, function(links) {
      console.log(links);
      res.links(links);

      //Find genres matching the query
      Genre.find({name: { '$regex': query, '$options': 'i' }}, {'__v': 0}).sort('name').skip(skipFrom).limit(size).exec(function (err, docs) {
        console.log(docs);
        if(err) {
          console.error(err);
        }
        res.send(docs);
      });
    });
  });
}
