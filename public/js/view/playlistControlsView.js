define([
  'jquery',
  'backbone',
  'handlebars',
  'backbone-collectionView',
  'js/view/song/songForPlaylist',
  'text!templates/playlistControls.html'
], function($, Backbone, Handlebars, BackboneCollectionView, SongForPlaylistView, PlaylistControlsTemplate) {

  return Backbone.View.extend({
    template: Handlebars.compile(PlaylistControlsTemplate),

    initialize: function (options) {
      this.orchestre = options.orchestre;
      this.playlist = options.orchestre.get('playlist');
      console.log(this.playlist);

      this.playlistCollectionView = new Backbone.CollectionView({
        el: $('ul#sortable-queue'),
        selectable: false,
        sortable: true,
        collection: this.playlist,
        modelView: SongForPlaylistView
      });

      this.playlistCollectionView.render();
      //this.listenTo(this.playlistCollectionView, 'sortStop', this.updateCursor);
    },

    events: {
      'click .queue-controls-clean': 'cleanPlaylist',
      'click .queue-controls-save': 'savePlaylist'
    },

    cleanPlaylist: function() {
      this.playlist.reset();
    },

    render: function () {
      this.$el.html(this.template());
      return this;
    }
  });

});
