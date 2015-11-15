define([
  'jquery',
  'backbone',
  'handlebars',
  'text!templates/upcoming.html'
], function($, Backbone, Handlebars, UpcomingTemplate) {

  return Backbone.View.extend({
    template: Handlebars.compile(UpcomingTemplate),

    initialize: function() {

    },

    events: {

    },

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });
});
