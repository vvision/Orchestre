define([
  'jquery',
  'backbone',
  'handlebars',
  'js/models/Artist',
  'js/models/Album',
  'text!templates/artist/artist.html',
  'text!templates/album/thumb.html'
], function($, Backbone, Handlebars, Artist, Album, ArtistTemplate, AlbumThumbTemplate) {

  return Backbone.View.extend({
    template: Handlebars.compile(ArtistTemplate),

    initialize: function(options) {
      this.artistId = options.artistId;
      console.log(this.artistId);

      this.artist = new Artist.Model({id: options.artistId});
      this.artist.on('change', this.render, this);
      this.artist.fetch();

      this.albums = new Album.Collection();
      this.albums.url = '/artists/' + this.artistId + '/albums';
      this.albums.on('reset', this.renderAlbums, this);
      this.albums.fetch({reset: true});
    },

    events: {},

    renderAlbums: function() {
      $('.albums').empty();
      this.albums.each(function(doc) {
        $('.albums').append(Handlebars.compile(AlbumThumbTemplate)({
          albumId: doc.get('_id'),
          albumName: doc.get('name')
        }));
      });
    },

    render: function() {
      this.$el.html(this.template({
        name: this.artist.get('name'),
        desc: this.artist.get('desc'),
        thumb: this.artist.get('img'),
        id: this.artist.get('id')
      }));
      return this;
    }
  });

});
