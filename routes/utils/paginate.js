var querystring = require('querystring');
var conf = require('../../config');

function paginate(currentPage, totalElements, type, query, field, size, protocol, callback) {
  //Pagination
  var hostname = conf.domain !== '' ? conf.domain : conf.host + ':' + conf.port;
  var uri = protocol + '://' + hostname + '/' + type +'?';
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

module.exports = paginate;
