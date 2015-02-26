define([
  'jquery',
  'backbone',
  'hogan',
  'js/models/Song',
  '/js/view/song/resultsView.js',
  'text!templates/search.html'
], function($, Backbone, Hogan, Song, ResultsView, SearchTemplate) {

  return Backbone.View.extend({

    initialize: function (options) {
      this.playlist = options.playlist;
      this.nowPlaying = options.nowPlaying;
      this.field = 'title';
    },

    events: {
      'click .play': 'playSong',
      'click .add': 'addToPlaylist',
      'click button:submit': 'search',
      'submit button:submit': 'search',
      'change input[name=field]': 'fieldOption'
    },

    fieldOption: function() {
      this.field = $('input[name=field]:checked').val();
      console.log(this.field);
    },

    search: function (e) {
      e.preventDefault();
      var queryStr = $('.search').val();
      console.log('Search: ' + queryStr);

      $('.results', this.$el).html(new ResultsView({filter: queryStr, field: this.field}).render().el);
    },

    addToPlaylist: function(e) {
      var self = this;
      var className = e.currentTarget.className.split(' ');
      var songId = className[1].trim();
      console.log(songId);

      var song = new Song.Model({id: songId});
      song.fetch({
        success: function() {
          self.playlist.add(song);
          console.log(self.playlist);
        },
        error: function(err) {
          console.log(err);
        }
      });
    },

    playSong: function(e) {
      var self = this;
      var className = e.currentTarget.className.split(' ');
      var songId = className[1].trim();
      console.log(songId);

      var song = new Song.Model({id: songId});
      song.fetch({
        success: function() {
          self.nowPlaying.reset();
          self.nowPlaying.add(song);
          console.log(self.nowPlaying);
        },
        error: function(err) {
          console.log(err);
        }
      });
    },

    render: function () {
      this.$el.html(Hogan.compile(SearchTemplate).render({
      }));
      $('.results', this.$el).html(new ResultsView({filter: '', field: ''}).render().el);
      return this;
    }
  });

});
