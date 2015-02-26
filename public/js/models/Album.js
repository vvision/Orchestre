define([
  'jquery',
  'backbone'
  ], function($, Backbone) {

  var Album = Backbone.Model.extend({
    urlRoot: '/albums'
  });

  var Albums = Backbone.Collection.extend({
    model: Album
  });

  return {
    Model: Album,
    Collection: Albums
  };

});
