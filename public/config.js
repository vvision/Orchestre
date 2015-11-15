requirejs.config({
  //baseUrl: '/',
  config: {
     i18n: {
      locale: localStorage.getItem('locale') || 'en',
     }
  },
  paths: {
    'backbone': 'js/lib/backbone-min',
    'jquery': 'js/lib/jquery.min',
    'underscore': 'js/lib/underscore-min',
    'text': 'js/lib/text',
    'handlebars': 'js/lib/handlebars.min',
    'bootstrap': 'js/lib/bootstrap.min',
    'backbone.paginator': 'js/lib/backbone.paginator.min',
    'sha512': 'js/lib/sha512',
    'jquery-ui': 'js/lib/jquery-ui.min',
    'backbone-collectionView': 'js/lib/backbone.collectionView.min'
  },
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'jquery': {
      exports: '$'
    },
    'underscore': {
      exports: '_'
    },
    'bootstrap': {
      deps: ['jquery']
    },
    'backbone.paginator': {
      deps: ['backbone']
    },
    'jquery-ui': {
      deps: ['jquery']
    },
    'backbone-collectionView': {
      deps: ['jquery', 'jquery-ui', 'backbone']
    }
  }
});
