define([
  'jquery',
  'backbone',
  'handlebars',
  'js/models/Song',
  'text!templates/song/thumb.html'
], function($, Backbone, Handlebars, Song, SongTemplate) {

  return Backbone.View.extend({
    tagName: 'tr',
    className: 'song',
    template: Handlebars.compile(SongTemplate),

    initialize: function (options) {
      this.orchestre = options.orchestre;
      this.playlist = options.orchestre.get('playlist');
    },

    events: {
      'click .song-controls-listen-now': 'addSongInQueueAndPlay',
      'click .song-controls-listen-next': 'addSongNextInQueue',
      'click .song-controls-listen-end': 'addSongEndInQueue',
      'click .song-download': 'downloadSong'
    },

    addSongInQueueAndPlay: function() {
      var index = this.playlist.indexOf(this.orchestre.get('playing'));
      this.playlist.add(this.model, {at: index});
      this.orchestre.set({playing: this.model});
      this.orchestre.trigger('playNewSong');

      console.log(this.playlist);
    },

    addSongNextInQueue: function() {
      var index = this.playlist.indexOf(this.orchestre.get('playing'));
      this.playlist.add(this.model, {at: index + 1});
      console.log(this.playlist);
    },

    addSongEndInQueue: function() {
      this.playlist.add(this.model);
    },

    downloadSong: function(e) {
      var url = e.currentTarget.href;
      console.log(url);
      window.open(url,'PromoteFirefoxWindowName', 'resizable,scrollbars,status');
    },

    render: function () {
      this.$el.html(this.template({
        songId: this.model.get('_id'),
        trackNumber: this.model.get('trackNumber'),
        songTitle: this.model.get('title'),
        artistName: this.model.get('artist'),
        albumTitle: this.model.get('album'),
        rated: this.model.get('rate'),
        type: this.model.get('type')
      }));
      return this;
    }
  });

});
