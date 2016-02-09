define([
  'jquery',
  'backbone',
  'handlebars',
  'orchestre',
  '/js/view/song/songView.js',
  'text!templates/pageControls.html',
  'js/models/Song'
], function($, Backbone, Handlebars, Orchestre, SongView, pageControlsTemplate, Song) {

  return Backbone.View.extend({
    template: Handlebars.compile(pageControlsTemplate),

    initialize: function (options) {
      this.router = Orchestre.getOrchestre().router;
      this.page = options.page || 1;
      this.links;
      console.log(options);

      var self = this;
      this.songs = new Song.Collection();
      this.songs.search({
        page: this.page
      }, function(collection, response, options) {
        self.links = self.parseLinks(options.xhr);
        console.log(options.xhr.getResponseHeader('Link'));
      });

      this.songs.on('reset', function() {
        $('.resultsData').empty();
        $('.resultsData').append('<table class="table songList"></table>');
        self.songs.each(function(song) {
          console.log(song);
          $('.songList').append(new SongView({model: song}).render().el);
        });
      });
    },

    events: {
      'click a.firstPage': 'firstPage',
      'click a.prevPage': 'prevPage',
      'click a.nextPage': 'nextPage',
      'click a.lastPage': 'lastPage'
    },

    parseLinks: function(xhr) {
      var PARAM_TRIM_RE = /[\s'"]/g;
      var URL_TRIM_RE = /[<>\s'"]/g;
      var links = {};

      var linkHeader = xhr.getResponseHeader('Link');
      if(linkHeader) {
        var relations = ['first', 'prev', 'next', 'last'];
        linkHeader.split(',').forEach(function(linkValue) {
          var linkParts = linkValue.split(';');
          var url = linkParts[0].replace(URL_TRIM_RE, '');
          var params = linkParts.slice(1);
          params.forEach(function (param) {
            var paramParts = param.split('=');
            var key = paramParts[0].replace(PARAM_TRIM_RE, '');
            var value = paramParts[1].replace(PARAM_TRIM_RE, '');
            if (key === 'rel' && relations.indexOf(value) !== -1) {
              links[value] = url;
            }
          });
        });
      }

      return links;
    },

    getUrlParam: function(url, name) {
      var param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(url);
      if(param) {
        return decodeURIComponent(param[1]);
      }
    },

    renderPageNumberFromUrlDataAndNavigate: function(url) {
      var pageNumber = this.getUrlParam(url, 'page');
      $('.page').html(pageNumber);

      this.router.navigate('/music/page/' + pageNumber);
    },

    getSongsWithUrl: function(url) {
      var self = this;
      this.songs.url = url;
      this.renderPageNumberFromUrlDataAndNavigate(url);
      this.songs.search({}, function(collection, response, options) {
        self.links = self.parseLinks(options.xhr);
      });
    },

    firstPage: function() {
      var first = this.links.first;
      if(first) {
        this.getSongsWithUrl(first);
      }
    },

    lastPage: function() {
      var last = this.links.last;
      if(last) {
        this.getSongsWithUrl(last);
      }
    },

    prevPage: function() {
      var prev = this.links.prev;
      if(prev) {
        this.getSongsWithUrl(prev);
      }
    },

    nextPage: function() {
      var next = this.links.next;
      if(next) {
        this.getSongsWithUrl(next);
      }
    },

    render: function() {
      this.$el.html(this.template({page: this.page}));
      return this;
    }
  });
});
