requirejs.config({
  //baseUrl: '/',
  config: {
     i18n: {
      locale: localStorage.getItem('locale') || 'en',
     }
  },
  paths: {
    'backbone': 'js/lib/backbone-1.1.2',
    'jquery': 'js/lib/jquery-2.1.0',
    'underscore': 'js/lib/underscore-1.6.0',
    'text': 'js/lib/text-2.0.12',
    'mocha': 'js/lib/mocha',
    'hogan': 'js/lib/hogan-3.0.0.amd',
    'i18n': 'i18n',
    'bootstrap': 'js/lib/bootstrap',
    'backbone.paginator': 'js/lib/backbone.paginator',
    'sha512': 'js/lib/sha512'
  },
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'jquery': {
      exports: '$'
    },
    'iframeTransport': {
      deps: ['jquery']
    },
    'underscore': {
      exports: '_'
    },
    'bootstrap': {
      deps: ['jquery']
    },
    'backbone.paginator': {
      deps: ['backbone']
    }
  }
});

define([
  'backbone',
  'js/view/navbarView',
  'js/view/upcomingView',
  'js/view/aboutView',
  'js/view/loginView',
  'js/view/artist/artistView',
  'js/view/artist/listView',
  'js/view/album/albumView',
  'js/view/album/listView',
  'js/view/song/searchView',
  'js/view/playerView',
  'js/view/playlistView',
  'js/view/user/newUserView',
  'js/view/adminView',
  'js/models/Song',
  'js/models/User'
], function(Backbone, NavbarView, UpcomingView, AboutView, LoginView, ArtistView, ArtistListView, AlbumView, AlbumListView, SearchView, PlayerView, PlaylistView, NewUserView, AdminView, Song, User) {

  var playlist = new Song.Collection();
  var nowPlaying = new Song.Collection();
  var user = new User.Model();

  var Router = Backbone.Router.extend({

    initialize: function () {
      $('header').html(new NavbarView({user: user}).render().el);
      $('#player').html(new PlayerView({playlist: playlist,  nowPlaying: nowPlaying}).render().el);
      $('#playlist').html(new PlaylistView({playlist: playlist, nowPlaying: nowPlaying}).render().el);
    },

    routes: {
      '': 'upcoming',
      'music': 'music',
      'about': 'about',
      'login': 'login',
      'artist': 'artistList',
      'artist/:id': 'artist',
      'album': 'albumList',
      'album/:id': 'album',
      'user/new': 'newUser',
      'denied': 'denied',
      'admin': 'admin'
    },

    admin: function() {
      $('#content').hide();
      $('#fullPage').show().html(new AdminView().render().el);
    },

    newUser: function() {
      $('#content').hide();
      $('#fullPage').show().html(new NewUserView().render().el);
    },
    albumList: function () {
      $('#fullPage').hide().empty();
      $('#content').show();
      $('#main').html(new AlbumListView().render().el);
    },
    album: function(id) {
      $('#fullPage').hide().empty();
      $('#content').show();
      $('#main').html(new AlbumView({albumId: id, playlist: playlist, nowPlaying: nowPlaying}).render().el);
    },
    artistList: function () {
      $('#fullPage').hide().empty();
      $('#content').show();
      $('#main').html(new ArtistListView().render().el);
    },
    artist: function (id) {
      $('#fullPage').hide().empty();
      $('#content').show();
      $('#main').html(new ArtistView({artistId: id}).render().el);
    },
    upcoming: function () {
      $('#content').hide();
      $('#fullPage').show().html(new UpcomingView().render().el);
    },

    music: function () {
      $('#fullPage').hide().empty();
      $('#content').show();
      $('#main').html(new SearchView({playlist: playlist, nowPlaying: nowPlaying}).render().el);
    },
    about: function() {
      $('#content').hide();
      $('#fullPage').show().html(new AboutView().render().el);
    },
    login: function() {
      $('#content').hide();
      $('#fullPage').show().html(new LoginView({user: user}).render().el);
    },
    denied: function () {
      $('#content').hide();
      //TODO: Create a denied view
      $('#fullPage').show().html(new UpcomingView().render().el);
    }
  });

  window.router = new Router();

  Backbone.history.start({pushState: true});

  $('body').on('click', 'a', function(e){
    // If you have external links handle it here
    e.preventDefault();
    var $a = $(e.target).closest('a');
    var href = $a.attr('href');

    if(href === '#') {
      return; // Escape the null link
    }
    if(href.indexOf('http') !== -1) {
      return; // Escape external links
    }
    if(href.indexOf('mailto') !== -1) {
      return; // Escape external links
    }
    if (href === '/logout') {
      $.ajax({
        url: '/auth/logout',
        type: 'POST',
        success: function() {
          sessionStorage.clear();
          user.clear();

          router.navigate('', true);
        },
        error: function(err) {
          console.log(err);
        }
      });
    } else {
      router.navigate(href, true);
    }
  });
});
