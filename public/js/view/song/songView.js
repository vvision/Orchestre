define([
  'jquery',
  'backbone',
  'handlebars',
  'orchestre',
  'js/models/Song',
  'text!templates/song/thumb.html'
], function($, Backbone, Handlebars, Orchestre, Song, SongTemplate) {

  return Backbone.View.extend({
    tagName: 'tr',
    className: 'song',
    template: Handlebars.compile(SongTemplate),

    initialize: function () {
      this.player = Orchestre.getOrchestre().player;
      this.playlist = this.player.get('playlist');
      this.user = Orchestre.getOrchestre().user;

      this.listenTo(this.model, 'favourite', this.toggleFavourite);
    },

    events: {
      'click .song-controls-listen-now': 'addSongInQueueAndPlay',
      'click .song-controls-listen-next': 'addSongNextInQueue',
      'click .song-controls-listen-end': 'addSongEndInQueue',
      'click .song-download': 'downloadSong',
      'click .song-favourite': 'favSong'
    },

    toggleFavourite: function() {
      if(this.model.get('favs').indexOf(this.user.id) !== -1) {
        $('.song-favourite', this.$el).removeClass('glyphicon-heart-empty');
        $('.song-favourite', this.$el).addClass('glyphicon-heart');
      } else {
        $('.song-favourite', this.$el).removeClass('glyphicon-heart');
        $('.song-favourite', this.$el).addClass('glyphicon-heart-empty');
      }
    },

    favSong: function() {
      var favs = this.model.get('favs');
      var pos = this.model.get('favs').indexOf(this.user.id);
      if(pos !== -1) {
        favs.splice(pos, 1);
      } else {
        favs.push(this.user.id);
      }
      var self = this;
      this.model.save(null, {success: function() {
        //Mutating the array will not change the pointer, and no "change" event is fired.
        //Explicit call
        self.model.trigger('favourite');
      }});
    },

    addSongInQueueAndPlay: function() {
      var index = this.playlist.indexOf(this.player.get('playing'));
      this.playlist.add(this.model, {at: index});
      this.player.set({playing: this.model});
      this.player.trigger('playNewSong');

      console.log(this.playlist);
    },

    addSongNextInQueue: function() {
      var index = this.playlist.indexOf(this.player.get('playing'));
      this.playlist.add(this.model, {at: index + 1});
      console.log(this.playlist);
    },

    addSongEndInQueue: function() {
      this.playlist.add(this.model);
    },

    downloadSong: function(e) {
      var url = e.currentTarget.href;
      console.log(url);
      window.open(url, 'PromoteFirefoxWindowName', 'resizable,scrollbars,status');
    },

    //Converts seconds into a string like mm:ss.
    convertSecondes: function(s) {
      var seconds = parseInt(s % 60);
      var minutes = parseInt((s / 60) % 60);

      // Ensure it's two digits. For example, 03 rather than 3.
      seconds = ('0' + seconds).slice(-2);
      minutes = ('0' + minutes).slice(-2);

      return minutes + ':' + seconds;
    },

    render: function () {
      this.$el.html(this.template({
        songId: this.model.get('_id'),
        trackNumber: this.model.get('trackNumber'),
        songTitle: this.model.get('title'),
        artistName: this.model.get('artist'),
        albumTitle: this.model.get('album'),
        rated: this.model.get('rate'),
        type: this.model.get('type'),
        duration: this.convertSecondes(this.model.get('duration'))
      }));
      this.toggleFavourite();
      return this;
    }
  });

});
