define([
  'jquery',
  'backbone',
  'handlebars',
  'js/models/Album',
  'js/models/Song',
  '/js/view/song/songView.js',
  'text!templates/album/album.html'
  ], function($, Backbone, Handlebars, Album, Song, SongView, AlbumTemplate) {

  return Backbone.View.extend({
    template: Handlebars.compile(AlbumTemplate),

    initialize: function(options) {
      this.albumId = options.albumId;
      this.orchestre = options.orchestre;
      this.playlist = options.orchestre.get('playlist');
      console.log(this.albumId);

      this.album = new Album.Model({id: options.albumId});
      this.album.on('change', this.renderAlbumName, this);
      this.album.fetch();

      this.songs = new Song.Collection();
      this.songs.url = '/albums/' + this.albumId + '/songs';
      this.songs.on('reset', this.renderSongs, this);
      this.songs.fetch({reset: true});
    },

    events: {
      'click .playAlbum': 'addAlbumToPlaylist'
    },

    addAlbumToPlaylist : function() {
      this.playlist.add(this.songs.models);
    },

    renderAlbumName: function() {
      $('.albumName').html(this.album.get('name'));
    },

    renderSongs: function() {
      var self = this;
      $('.songList').empty();
      this.songs.each(function(song) {
        $('.songList').append(new SongView({model: song, orchestre: self.orchestre}).render().el);
      });
    },

    render: function() {
      this.$el.html(this.template({
        name: this.album.get('name')
      }));
      return this;
    }
  });

});
