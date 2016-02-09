define([
  'jquery',
  'backbone',
  'handlebars',
  'orchestre',
  '/js/view/song/resultsView.js',
  '/js/view/artist/resultsView.js',
  '/js/view/album/resultsView.js',
  'text!templates/search.html',
  'text!templates/simpleSearch.html'
], function($, Backbone, Handlebars, Orchestre, SongResultsView, ArtistResultsView, AlbumResultsView, SearchSongTemplate, SimpleSearchTemplate) {

  return Backbone.View.extend({
    template: Handlebars.compile(SearchSongTemplate),

    initialize: function (options) {
      this.searchObj = options.searchObj;
      this.player = Orchestre.getOrchestre().player;
      this.playlist = this.player.get('playlist');
      this.field = 'title';
    },

    events: {
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
      var self = this;
      var queryStr = $('.search').val();
      console.log('Search: ' + queryStr);

      //TODO: Switch case ?
      if(this.searchObj === 'song') {
        $('.results', this.$el).html(new SongResultsView({
          filter: queryStr,
          field: self.field
        }).render().el);
      } else if(this.searchObj === 'artist') {
        $('.results', this.$el).html(new ArtistResultsView({filter: queryStr}).render().el);
      } else if(this.searchObj === 'album') {
        $('.results', this.$el).html(new AlbumResultsView({filter: queryStr}).render().el);
      }
    },

    render: function () {
      if(this.searchObj === 'song') {
        this.$el.html(this.template());
        $('.results', this.$el).html(new SongResultsView({filter: '', field: ''}).render().el);
      } else if(this.searchObj === 'artist') {
        this.$el.html(Handlebars.compile(SimpleSearchTemplate));
        $('.results', this.$el).html(new ArtistResultsView({filter: ''}).render().el);
      } else if(this.searchObj === 'album') {
        this.$el.html(Handlebars.compile(SimpleSearchTemplate));
        $('.results', this.$el).html(new AlbumResultsView({filter: ''}).render().el);
      }
      return this;
    }
  });

});
