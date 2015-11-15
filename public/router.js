define([
  'backbone',
  'js/view/navbarView',
  'js/view/upcomingView',
  'js/view/aboutView',
  'js/view/loginView',
  'js/view/artist/artistView',
  'js/view/album/albumView',
  'js/view/searchView',
  'js/view/playerView',
  'js/view/playlistControlsView',
  'js/view/user/newUserView',
  'js/view/adminView',
  'js/models/Song',
  'js/models/User',
  'js/models/Orchestre'
], function(Backbone, NavbarView, UpcomingView, AboutView, LoginView,
    ArtistView, AlbumView, SearchView, PlayerView, PlaylistControlsView,
    NewUserView, AdminView, Song, User, Orchestre) {

  var orchestre = new Orchestre();
  orchestre.set({playlist: new Song.Collection()});

  var user = new User.Model();

  var Router = Backbone.Router.extend({

    initialize: function () {
      $('header').html(new NavbarView({user: user}).render().el);
      $('#player').html(new PlayerView({orchestre: orchestre}).render().el);
      $('#playlistControls').html(new PlaylistControlsView({orchestre: orchestre}).render().el);
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
      $('#main').html(new SearchView({orchestre: orchestre, searchObj: 'album'}).render().el);
    },
    album: function(id) {
      $('#fullPage').hide().empty();
      $('#content').show();
      $('#main').html(new AlbumView({albumId: id, orchestre: orchestre}).render().el);
    },
    artistList: function () {
      $('#fullPage').hide().empty();
      $('#content').show();
      $('#main').html(new SearchView({orchestre: orchestre, searchObj: 'artist'}).render().el);
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
      $('#main').html(new SearchView({orchestre: orchestre, searchObj: 'song'}).render().el);
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
    if(href.indexOf('download') !== -1) {
      return; // Escape link to server
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
