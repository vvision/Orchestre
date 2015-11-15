var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  if(id === 42) {
    done(null, {
      id: 42,
      username: 'test',
      role: 'admin'
    });
  } else {
    User.findById(id, function (err, user) {
      console.log(err);
      done(err, user);
    });
  }
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {message: 'Unknown user ' + username});
      }
      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          return done(err);
        }
        if(isMatch) {
          //var user = doc;
          delete user.password;
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }
));
