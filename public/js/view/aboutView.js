define([
  'jquery',
  'backbone',
  'handlebars',
  'text!templates/about.html'
], function($, Backbone, Handlebars, AboutTemplate) {

  return Backbone.View.extend({
    template: Handlebars.compile(AboutTemplate),

    initialize: function() {

    },

    events: {},

    render: function() {
      this.$el.html(this.template({
        text: 'Lorem Ipsus',
        title: 'About'
      }));
      return this;
    }
  });

});
