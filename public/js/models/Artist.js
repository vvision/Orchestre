define([
  'jquery',
  'backbone'
  ], function($, Backbone) {

  var Artist = Backbone.Model.extend({
    urlRoot: '/artists'
  });

  return {
    Model: Artist
  };

});
