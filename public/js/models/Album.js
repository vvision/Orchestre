define([
  'jquery',
  'backbone'
], function($, Backbone) {

  var Album = Backbone.Model.extend({
    urlRoot: '/albums',
    idAttribute: '_id'
  });

  var Albums = Backbone.Collection.extend({
    model: Album,
    url: '/albums',
    search: function(params, callback) {
      this.fetch({
        data: params,
        reset: true,
        success: callback
      });
    }
  });

  return {
    Model: Album,
    Collection: Albums
  };

});
