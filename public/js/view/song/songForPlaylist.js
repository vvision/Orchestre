define([
  'jquery',
  'backbone',
  'handlebars',
  'js/models/Song',
  'text!templates/song/songForPlaylist.html'
], function($, Backbone, Handlebars, Song, SongTemplate) {

  return Backbone.View.extend({
    //tagName: 'tr',
    //className: 'song',
    template: Handlebars.compile(SongTemplate),

    initialize: function (options) {

    },

    events: {
      'click .queue-song-remove': 'removeFromCollection'
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
      return this;
    }
  });

});
