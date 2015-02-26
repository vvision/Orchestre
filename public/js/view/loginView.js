define([
  'jquery',
  'backbone',
  'hogan',
  'bootstrap',
  'sha512',
  'text!templates/login.html',
  'text!templates/alert.html'
  ], function($, Backbone, Hogan, Bootstrap, SHA, LoginTemplate, AlertTemplate) {

  return Backbone.View.extend({

    initialize: function(options) {
      this.user = options.user;
    },

    events: {
      'click button:submit': 'tryAuth',
      'submit button:submit': 'tryAuth'
    },

    displayAlert: function(alertType, strongText, message) {
      $('.msg').empty().append(Hogan.compile(AlertTemplate).render({
        alertType: alertType,
        strongText: strongText,
        message: message,
      }));
    },

    tryAuth: function(e) {
      e.preventDefault();
      var self = this;
      var shaObj = new SHA($('.password').val(), 'TEXT');
      var hash = shaObj.getHash('SHA-512', 'HEX');

      $.ajax({
        url: '/auth/login',
        type: 'POST',
        data: {
          login: $('.login').val(),
          password: hash
        },
        success: function(user) {
          sessionStorage.setItem('auth', 'true');
          sessionStorage.setItem('role', user.role);

          self.user.set(user);
          self.displayAlert('alert-success', 'Congratulations!', 'You can now enjoy your music.');
        },
        error: function(err) {
          console.log(err);
          self.displayAlert('alert-danger', 'Error!', 'Something went wrong :/. Check your login, password, or look at the logs.');
        }
      });
    },

    render: function() {
      this.$el.html(Hogan.compile(LoginTemplate).render({
        login: 'Login',
        password: 'Password',
        title: 'Authentication',
        connect: 'Connect'
      }));
      return this;
    }
  });

});
