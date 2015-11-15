var gulp = require('gulp');
var eslint = require('gulp-eslint');
var exec = require('child_process').exec;

gulp.task('copy-js', function() {
  gulp.src([
    './node_modules/underscore/underscore-min.js',
    './node_modules/handlebars/dist/handlebars.min.js',
    './node_modules/requirejs/require.js',
    './node_modules/requirejs-text/text.js',
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/jquery-ui-bundle/jquery-ui.min.js',
    './node_modules/backbone/backbone-min.js',
    './node_modules/backbone.paginator/lib/backbone.paginator.min.js',
    './node_modules/bb-collection-view/dist/backbone.collectionView.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js'
    //'./node_modules/jssha/src/sha.js'
  ])
  .pipe(gulp.dest('public/js/lib'));
});

gulp.task('copy-fonts', function() {
  gulp.src('./node_modules/bootstrap/dist/fonts/*')
  .pipe(gulp.dest('public/fonts'));
});

gulp.task('copy-css', function() {
  gulp.src([
    './node_modules/bootstrap/dist/css/bootstrap.min.css',
    './node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
    './node_modules/jquery-ui-bundle/jquery-ui.min.css',
    './node_modules/jquery-ui-bundle/jquery-ui.structure.min.css',
    './node_modules/jquery-ui-bundle/jquery-ui.theme.min.css'
  ])
  .pipe(gulp.dest('public/css'));
});


gulp.task('build-copy-player-codecs', ['build-aurora', 'build-flac', 'build-mp3'], function() {
  gulp.src([
    './node_modules/av/build/aurora.js',
    './node_modules/flac.js/build/flac.js',
    './node_modules/mp3/build/mp3.js',
  ])
  .pipe(gulp.dest('public/js/lib'));
});

gulp.task('build-aurora', function(cb) {
  exec('npm install', {cwd: 'node_modules/av'}, function(err) {
    if (err) {
      return cb(err);
    }
    exec('make clean', {cwd: 'node_modules/av'}, function(err) {
      if (err) {
        return cb(err);
      }
      exec('make browser', {cwd: 'node_modules/av'}, function(err) {
        if (err) {
          return cb(err);
        }
        cb();
      });
    });
  });
});

gulp.task('build-flac', function(cb) {
  exec('npm install', {cwd: 'node_modules/flac.js'}, function(err) {
    if (err) {
      return cb(err);
    }
    exec('make browser', {cwd: 'node_modules/flac.js'}, function(err) {
      if (err) {
        return cb(err);
      }
      cb();
    });
  });
});

gulp.task('build-mp3', function(cb) {
  exec('npm install', {cwd: 'node_modules/mp3'}, function(err) {
    if (err) {
      return cb(err);
    }
    exec('make browser', {cwd: 'node_modules/mp3'}, function(err) {
      if (err) {
        return cb(err);
      }
      cb();
    });
  });
});

gulp.task('lint', function () {
  return gulp.src([
      'orchestre.js',
      'routes/**/*.js',
      'public/js/view/*.js',
      'public/js/models/*.js'
    ])
    // eslint() attaches the lint output to the eslint property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe(eslint.failOnError());
});
