define([
  'jquery',
  'backbone',
  'hogan',
  '/js/view/artist/resultsView.js',
  'text!templates/simpleSearch.html'
], function($, Backbone, Hogan, ResultsView, SearchTemplate) {

  return Backbone.View.extend({

    initialize: function () {},

    events: {
      'click button:submit': 'search',
      'submit button:submit': 'search'
    },

    search: function (e) {
      e.preventDefault();
      var queryStr = $('.search').val();
      console.log('Search: ' + queryStr);

      $('.results', this.$el).html(new ResultsView({filter: queryStr}).render().el);
    },

    render: function () {
      this.$el.html(Hogan.compile(SearchTemplate).render({
      }));
      $('.results', this.$el).html(new ResultsView({filter: ''}).render().el);
      return this;
    }
  });

});
