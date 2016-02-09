define([
  'backbone',
  'orchestre',
  'js/view/navbarView',
  'js/view/upcomingView',
  'js/view/aboutView',
  'js/view/loginView',
  'js/view/artist/artistView',
  'js/view/artist/artistList',
  'js/view/album/albumView',
  'js/view/album/albumList',
  'js/view/searchView',
  'js/view/playerView',
  'js/view/playlistControlsView',
  'js/view/user/newUserView',
  'js/view/adminView',
  'js/view/song/songList',
  'js/view/song/favouritesList',
  'js/models/Song',
  'js/models/User',
  'js/models/Player'
], function(Backbone, Orchestre, NavbarView, UpcomingView, AboutView, LoginView,
    ArtistView, ArtistListView, AlbumView, AlbumListView, SearchView, PlayerView, PlaylistControlsView,
    NewUserView, AdminView, SongListView, FavouritesListView,
    Song, User, Player) {

  var orchestre = Orchestre.getOrchestre();

  orchestre.player = new Player();
  orchestre.player.set({playlist: new Song.Collection()});
  orchestre.user = new User.Model();

  var Router = Backbone.Router.extend({

    initialize: function () {
      $('header').html(new NavbarView().render().el);
      $('#player').html(new PlayerView().render().el);
      $('#playlistControls').html(new PlaylistControlsView().render().el);
    },

    routes: {
      '': 'upcoming',
      'music': 'music',
      'music/page/:page': 'music',
      'about': 'about',
      'login': 'login',
      'artist': 'artistList',
      'artist/page/:page': 'artistList',
      'artist/:id': 'artist',
      'album': 'albumList',
      'album/page/:page': 'albumList',
      'album/:id': 'album',
      'user/new': 'newUser',
      'denied': 'denied',
      'admin': 'admin',
      'search': 'search',
      'favourites': 'favourites',
      'favourites/page/:page': 'favourites'
    },

    admin: function() {
      $('#content').hide();
      $('#fullPage').show().html(new AdminView().render().el);
    },

    newUser: function() {
      $('#content').hide();
      $('#fullPage').show().html(new NewUserView().render().el);
    },
    albumList: function (page) {
      $('#fullPage').hide().empty();
      $('#content').show();
      $('#main').html(new AlbumListView({page: page}).render().el);
    },
    album: function(id) {
      $('#fullPage').hide().empty();
      $('#content').show();
      $('#main').html(new AlbumView({albumId: id}).render().el);
    },
    artistList: function (page) {
      $('#fullPage').hide().empty();
      $('#content').show();
      $('#main').html(new ArtistListView({page: page}).render().el);
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

    music: function (page) {
      $('#fullPage').hide().empty();
      $('#content').show();
      $('#main').html(new SongListView({page: page}).render().el);
    },
    search: function () {
      $('#fullPage').hide().empty();
      $('#content').show();
      $('#main').html(new SearchView({searchObj: 'song'}).render().el);
    },
    favourites: function (page) {
      $('#fullPage').hide().empty();
      $('#content').show();
      $('#main').html(new FavouritesListView({page: page}).render().el);
    },
    about: function() {
      $('#content').hide();
      $('#fullPage').show().html(new AboutView().render().el);
    },
    login: function() {
      $('#content').hide();
      $('#fullPage').show().html(new LoginView().render().el);
    },
    denied: function () {
      $('#content').hide();
      //TODO: Create a denied view
      $('#fullPage').show().html(new UpcomingView().render().el);
    }
  });

  Orchestre.getOrchestre().router = new Router();
  Backbone.history.start({pushState: true});

  $(document).on('click', 'a:not([data-bypass])', function(evt) {
    var href = {
      prop: $(this).prop('href'),
      attr: $(this).attr('href')
    };
    var root = location.protocol + '//' + location.host + Backbone.history.options.root;

    if (href.prop && href.prop.slice(0, root.length) === root) {
      evt.preventDefault();
      Backbone.history.navigate(href.attr, true);
    }
  });

});
