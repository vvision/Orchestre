define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/about.html'
  ], function($, Backbone, Hogan, AboutTemplate) {

  return Backbone.View.extend({
    initialize: function() {

    },

    events: {},

    render: function() {
      this.$el.html(Hogan.compile(AboutTemplate).render({
        text: 'Lorem Ipsus',
        title: 'About'
      }));
      return this;
    }
  });

});
