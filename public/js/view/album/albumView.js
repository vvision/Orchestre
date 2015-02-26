define([
  'jquery',
  'backbone',
  'hogan',
  'js/models/Album',
  'js/models/Song',
  'text!templates/album/album.html',
  'text!templates/song/thumb.html'
  ], function($, Backbone, Hogan, Album, Song, AlbumTemplate, SongTemplate) {

  return Backbone.View.extend({
    initialize: function(options) {
      this.albumId = options.albumId;
      this.playlist = options.playlist;
      this.nowPlaying = options.nowPlaying;
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
      'click .play': 'playSong',
      'click .add': 'addToPlaylist',
      'click .playAlbum': 'addAlbumToPlaylist'
    },

    addAlbumToPlaylist : function() {
      this.playlist.add(this.songs.models);
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

    renderAlbumName: function() {
      $('.albumName').html(this.album.get('name'));
    },

    renderSongs: function() {
      $('.songList').empty();
      this.songs.each(function(doc) {
        $('.songList').append(Hogan.compile(SongTemplate).render({
          songId: doc.get('_id'),
          trackNumber: doc.get('trackNumber'),
          songTitle: doc.get('title'),
          artistName: doc.get('artist'),
          albumTitle: doc.get('album'),
          rated: doc.get('rate')
        }));
      });
    },

    render: function() {
      this.$el.html(Hogan.compile(AlbumTemplate).render({
        name: this.album.get('name')
      }));
      return this;
    }
  });

});
