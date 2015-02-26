define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/playlist.html',
  'text!templates/song/songForPlaylist.html'
], function($, Backbone, Hogan, PlaylistTemplate, SongForPlaylistTemplate) {

  return Backbone.View.extend({
    initialize: function (options) {
      this.playlist = options.playlist;
      this.nowPlaying = options.nowPlaying;
          console.log(this.playlist);

          this.listenTo(this.playlist, 'add', this.renderNewSong);
          this.listenTo(this.playlist, 'remove', this.removeFromView);
          this.listenTo(this.playlist, 'reset', this.resetPlaylistView);
    },

    events: {
      'click .remove': 'removeFromCollection'
    },

    renderNewSong: function(last) {
      console.log(last);
      //TODO: Check if song is not already in the playlist before adding it in the view
      //because we do not want duplicates.
      $('.songWaitingList').append(Hogan.compile(SongForPlaylistTemplate).render({
        songId: last.get('_id'),
        songTitle: last.get('title'),
        artistName: last.get('artist'),
        albumTitle: last.get('album')
      }));
    },

    removeFromView: function(song) {
      console.log(song.get('_id'));
      $('.songInPlaylist .' + song.get('_id')).remove();
      console.log('Trying to remove');
    },

    resetPlaylistView: function() {
      $('.songWaitingList').empty();
    },

    removeFromCollection: function(e) {
      console.log('REMOVE FROM COLLECTION');
      var className = e.currentTarget.className.split(' ');
      var id = className[0].trim();
      console.log(id);
      var song = this.playlist.findWhere({id: id});
      this.playlist.remove(song);
    },

    render: function () {
      this.$el.html(Hogan.compile(PlaylistTemplate).render({
      }));
      return this;
    }
  });

});
