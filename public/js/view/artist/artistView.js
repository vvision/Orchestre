define([
  'jquery',
  'backbone',
  'hogan',
  'js/models/Artist',
  'js/models/Album',
  'text!templates/artist/artist.html',
  'text!templates/album/thumb.html'
  ], function($, Backbone, Hogan, Artist, Album, ArtistTemplate, AlbumThumbTemplate) {

  return Backbone.View.extend({
    initialize: function(options) {
      this.artistId = options.artistId;
      console.log(this.artistId);

      this.artist = new Artist.Model({id: options.artistId});
      this.artist.on('change', this.renderArtistName, this);
      this.artist.fetch();

      this.albums = new Album.Collection();
      this.albums.url = '/artists/' + this.artistId + '/albums';
      this.albums.on('reset', this.renderAlbums, this);
      this.albums.fetch({reset: true});
    },

    events: {},

    renderArtistName: function() {
      $('.artistName').html(this.artist.get('name'));
    },

    renderAlbums: function() {
      $('.albums').empty();
      this.albums.each(function(doc) {
        $('.albums').append(Hogan.compile(AlbumThumbTemplate).render({
          albumId: doc.get('_id'),
          albumName: doc.get('name'),
        }));
      });
    },

    render: function() {
      this.$el.html(Hogan.compile(ArtistTemplate).render({
        name: this.artist.get('name')
      }));
      return this;
    }
  });

});
