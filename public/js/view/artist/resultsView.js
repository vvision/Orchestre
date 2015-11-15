define([
  'jquery',
  'backbone',
  'backbone.paginator',
  'handlebars',
  'text!templates/results.html',
  'text!templates/artist/thumb.html'
  ], function($, Backbone, Paginator, Handlebars, ResultsTemplate, ArtistThumbTemplate) {

  return Backbone.View.extend({
    template: Handlebars.compile(ResultsTemplate),

    initialize: function (options) {
      this.filter = options.filter;
      console.log(options);
      var uri = 'search/artists';

      //Setup pageable collection
      var Doc = Backbone.Model.extend({});

      var Docs = Backbone.PageableCollection.extend({
        model: Doc,
        url: uri,
        mode: 'infinite',
        state: {
          firstPage: 1,
          pageSize: 12
        },
        queryParams: {
          q: this.filter,
          currentPage: 'page',
          pageSize: 'size',
          order: null,
          totalPages: null,
          totalRecords: null,
          sortKey: null,
          directions: null
        }
      });

      this.docs = new Docs();

      //Initialize data
      this.docs.getFirstPage();
      console.log(this.docs);

      var self = this;
      this.docs.on('reset', function() {
        $('.resultsData').empty();
        self.docs.each(function(doc) {
          var dataEl = doc.attributes;
          console.log(dataEl);
          $('.resultsData').append(Handlebars.compile(ArtistThumbTemplate)({
            artistId: dataEl._id,
            artistName: dataEl.name,
          }));
        });
      });
    },

    events: {
      'click a.firstPage': 'firstPage',
      'click a.prevPage': 'prevPage',
      'click a.nextPage': 'nextPage',
      'click a.lastPage': 'lastPage'
    },

    firstPage: function() {
      this.docs.getFirstPage();
    },

    lastPage: function() {
      this.docs.getLastPage();
    },

    prevPage: function() {
      if(this.docs.hasPreviousPage()) {
        this.docs.getPreviousPage();
      }
    },

    nextPage: function() {
      if(this.docs.hasNextPage()) {
        this.docs.getNextPage();
      }
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });
});
