define([
  'jquery',
  'backbone',
  'backbone.paginator',
  'handlebars',
  '/js/view/song/songView.js',
  'text!templates/results.html',
  'js/models/Song'
  ], function($, Backbone, Paginator, Handlebars, SongView, ResultsTemplate, Song) {

  return Backbone.View.extend({
    template: Handlebars.compile(ResultsTemplate),

    initialize: function (options) {
      this.orchestre = options.orchestre;
      this.type = options.type;
      this.filter = options.filter;
      this.field = options.field;
      this.links;
      console.log(options);

      var self = this;
      this.songs = new Song.Collection();
      this.songs.search({
        q: this.filter,
        field: this.field || 'title',
        size: 12,
        page: 1
      }, function(collection, response, options) {
        self.links = self.parseLinks(options.xhr);
        console.log(options.xhr.getResponseHeader('Link'));
      });

      this.songs.on('reset', function() {
        $('.resultsData').empty();
        $('.resultsData').append('<table class="table songList"></table>');
        self.songs.each(function(song) {
          console.log(song);
          $('.songList').append(new SongView({model: song, orchestre: self.orchestre}).render().el);
        });
      });
    },

    events: {
      'click a.firstPage': 'firstPage',
      'click a.prevPage': 'prevPage',
      'click a.nextPage': 'nextPage',
      'click a.lastPage': 'lastPage',
      'click .rateInc': 'rateInc',
      'click .rateDec': 'rateDec'
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

    firstPage: function() {
      var self = this;
      if(this.links.first) {
        this.songs.url = this.links.first;
        this.songs.search({}, function(collection, response, options) {
          self.links = self.parseLinks(options.xhr);
        });
      }
    },

    lastPage: function() {
      var self = this;
      if(this.links.last) {
        this.songs.url = this.links.last;
        this.songs.search({}, function(collection, response, options) {
          self.links = self.parseLinks(options.xhr);
        });
      }
    },

    prevPage: function() {
      var self = this;
      if(this.links.prev) {
        this.songs.url = this.links.prev;
        this.songs.search({}, function(collection, response, options) {
          self.links = self.parseLinks(options.xhr);
        });
      }
    },

    nextPage: function() {
      var self = this;
      if(this.links.next) {
        this.songs.url = this.links.next;
        this.songs.search({}, function(collection, response, options) {
          self.links = self.parseLinks(options.xhr);
        });
      }
    },

    //Deprecated
    rateInc: function(e) {
      console.log('Inc');
      var className = e.target.parentNode.className.split(' ');
      var songId = className[1].trim();
      console.log(songId);
      var uri = '/songs/' + songId + '/rate/inc';

      var id = '.rate.' + songId;
      $.ajax({
        url: uri,
        type: 'POST',
        success: function (data) {
          console.log(data);
          var rate = $(id).html();
          $(id).html(parseInt(rate) + 1);
        },
        error: function(err) {
          console.log(err);
        }
      });
    },

    //Deprecated
    rateDec: function(e) {
      console.log('Dec');
      var className = e.target.parentNode.className.split(' ');
      var songId = className[1].trim();
      console.log(songId);
      var uri = '/songs/' + songId + '/rate/dec';

      var id = '.rate.' + songId;
      $.ajax({
        url: uri,
        type: 'POST',
        success: function (data) {
          console.log(data);
          var rate = $(id).html();
          $(id).html(parseInt(rate) - 1);
        },
        error: function(err) {
          console.log(err);
        }
      });
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });
});
