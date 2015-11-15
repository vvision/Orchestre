define([
  'jquery',
  'backbone'
], function($, Backbone) {

  var User = Backbone.Model.extend({
    urlRoot: '/users',
    defaults: {
      username: null,
      role: null
    }
  });

  var Users = Backbone.Collection.extend({
    model: User
  });

  return {
    Model: User,
    Collection: Users
  };

});
