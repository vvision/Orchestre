define([
  'jquery',
  'backbone'
], function($, Backbone) {

  var Artist = Backbone.Model.extend({
    urlRoot: '/artists',
    idAttribute: '_id'
  });

  var Artists = Backbone.Collection.extend({
    model: Artist,
    url: '/artists',
    search: function(params, callback) {
      this.fetch({
        data: params,
        reset: true,
        success: callback
      });
    }
  });

  return {
    Model: Artist,
    Collection: Artists
  };

});
