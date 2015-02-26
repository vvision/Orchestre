define([
  'jquery',
  'backbone',
  'backbone.paginator',
  'hogan',
  'text!templates/results.html',
  'text!templates/song/thumb.html'
  ], function($, Backbone, Paginator, Hogan, ResultsTemplate, SongTemplate) {

  return Backbone.View.extend({
    initialize: function (options) {
      this.type = options.type;
      this.filter = options.filter;
      this.field = options.field;
      console.log(options);
      var uri = 'search/songs';
      var queryParams = {};

      if(this.filter !== '') {
        queryParams.q = this.filter;
      }
      if(this.field !== '' && this.field !== 'title') {
        queryParams.field = this.field;
      }
      if(this.filter !== '' || this.field !== '') {
        uri += '?' + $.param(queryParams);
      }

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
        $('.resultsData').append('<table class="table songList"></table>');
        self.docs.each(function(doc) {
          var dataEl = doc.attributes;
          console.log(dataEl);
          $('.songList').append(Hogan.compile(SongTemplate).render({
            songId: dataEl._id,
            trackNumber: dataEl.trackNumber,
            songTitle: dataEl.title,
            artistName: dataEl.artist,
            albumTitle: dataEl.album,
            rated: dataEl.rate
          }));
        });
      });
    },

    events: {
      'click a.firstPage': 'firstPage',
      'click a.prevPage': 'prevPage',
      'click a.nextPage': 'nextPage',
      'click a.lastPage': 'lastPage',
      'click .rateInc': 'rateInc',
      'click .rateDec': 'rateDec'
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

    rateInc: function(e) {
      console.log('Inc');
      var className = e.target.parentNode.className.split(' ');
      var songId = className[1].trim();
      console.log(songId);
      var uri = '/songs/' + songId + '/rate/inc';

      var id = '.rate.' + songId;
      $.ajax({
        url: uri,
        type: 'POST',
        success: function (data) {
          console.log(data);
          var rate = $(id).html();
          $(id).html(parseInt(rate) + 1);
        },
        error: function(err) {
          console.log(err);
        }
      });
    },

    rateDec: function(e) {
      console.log('Dec');
      var className = e.target.parentNode.className.split(' ');
      var songId = className[1].trim();
      console.log(songId);
      var uri = '/songs/' + songId + '/rate/dec';

      var id = '.rate.' + songId;
      $.ajax({
        url: uri,
        type: 'POST',
        success: function (data) {
          console.log(data);
          var rate = $(id).html();
          $(id).html(parseInt(rate) - 1);
        },
        error: function(err) {
          console.log(err);
        }
      });
    },

    render: function() {
      this.$el.html(Hogan.compile(ResultsTemplate).render({}));
      return this;
    }
  });
});
