define([
  'jquery',
  'backbone'
  ], function($, Backbone) {

  var Song = Backbone.Model.extend({
    urlRoot: '/songs',
    defaults: {
      songId: null,
      title: 'Unknown Title',
      artist: 'Unknown Artist',
      album: 'Unknwon Album',
      rate: 0,
      track: 0,
      genre: 'Unknown Genre'
    }
  });

  var Songs = Backbone.Collection.extend({
    model: Song
  });

  return {
    Model: Song,
    Collection: Songs
  };

});
