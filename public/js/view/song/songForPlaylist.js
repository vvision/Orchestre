define([
  'jquery',
  'backbone',
  'handlebars',
  'orchestre',
  'js/models/Song',
  'text!templates/song/songForPlaylist.html'
], function($, Backbone, Handlebars, Orchestre, Song, SongTemplate) {

  return Backbone.View.extend({
    //tagName: 'tr',
    //className: 'song',
    template: Handlebars.compile(SongTemplate),

    initialize: function () {
      this.user = Orchestre.getOrchestre().user;
      this.listenTo(this.model, 'favourite', this.toggleFavourite);
    },

    events: {
      'click .queue-song-remove': 'removeFromCollection',
      'click .queue-song-favourite': 'favSong'
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

    removeFromCollection: function() {
      console.log('REMOVE FROM COLLECTION');
      var playlist = this.collectionListView.collection;
      playlist.remove(this.model);
    },

    render: function () {
      this.$el.html(this.template({
        songId: this.model.get('_id'),
        songTitle: this.model.get('title'),
        artistName: this.model.get('artist'),
        albumTitle: this.model.get('album'),
        albumId: this.model.get('albumId')
      }));
      this.toggleFavourite();
      return this;
    }
  });

});
