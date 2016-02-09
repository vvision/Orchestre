define([
  'jquery',
  'backbone',
  'handlebars',
  'bootstrap',
  'orchestre',
  'sha512',
  'text!templates/login.html',
  'text!templates/alert.html'
], function($, Backbone, Handlebars, Bootstrap, Orchestre, SHA, LoginTemplate, AlertTemplate) {

  return Backbone.View.extend({
    template: Handlebars.compile(LoginTemplate),

    initialize: function() {
      this.user = Orchestre.getOrchestre().user;
    },

    events: {
      'click button:submit': 'tryAuth',
      'submit button:submit': 'tryAuth'
    },

    displayAlert: function(alertType, strongText, message) {
      $('.msg').empty().append(Handlebars.compile(AlertTemplate)({
        alertType: alertType,
        strongText: strongText,
        message: message
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
          username: $('.login').val(),
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
      this.$el.html(this.template({
        login: 'Login',
        password: 'Password',
        title: 'Authentication',
        connect: 'Connect'
      }));
      return this;
    }
  });

});
