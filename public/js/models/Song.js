define([
  'jquery',
  'backbone'
], function($, Backbone) {

  var Song = Backbone.Model.extend({
    urlRoot: '/songs',
    idAttribute: '_id',
    defaults: {
      songId: null,
      albumId: null,
      title: 'Unknown Title',
      artist: 'Unknown Artist',
      album: 'Unknwon Album',
      rate: 0,
      track: 0,
      duration: 0,
      genre: 'Unknown Genre',
      type: null,
      favs: []
    }
  });

  var Songs = Backbone.Collection.extend({
    model: Song,
    url: '/songs',
    search: function(params, callback) {
      this.fetch({
        data: params,
        reset: true,
        success: callback
      });
    }
  });

  return {
    Model: Song,
    Collection: Songs
  };

});
