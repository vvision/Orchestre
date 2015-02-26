define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/upcoming.html'
  ], function($, Backbone, Hogan, UpcomingTemplate) {

  return Backbone.View.extend({
    initialize: function() {

    },

    events: {

    },

    render: function() {
      this.$el.html(Hogan.compile(UpcomingTemplate).render({}));
      return this;
    }
  });
});
