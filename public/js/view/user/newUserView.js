define([
  'jquery',
  'backbone',
  'handlebars',
  'bootstrap',
  'sha512',
  'text!templates/user/newUserForm.html',
  'text!templates/alert.html',
  'js/models/User'
  ], function($, Backbone, Handlebars, Bootstrap, SHA, NewUserTemplate, AlertTemplate, User) {

  return Backbone.View.extend({
    template: Handlebars.compile(NewUserTemplate),

    initialize: function() {
      this.user = new User.Model();
    },

    events: {
      'click button:submit': 'postUser',
      'submit button:submit': 'postUser'
    },

    displayAlert: function(alertType, strongText, message) {
      $('.msg').empty().append(Handlebars.compile(AlertTemplate)({
        alertType: alertType,
        strongText: strongText,
        message: message,
      }));
    },

    postUser: function(e) {
      e.preventDefault();
      var self = this;
      var shaObj = new SHA($('.password').val(), 'TEXT');
      var hash = shaObj.getHash('SHA-512', 'HEX');

      this.user.set({
        username: $('.username').val(),
        password: hash,
        mail: $('.mail').val(),
        role: 'user'//For now, just possible to create basic user.
      });

      this.user.save({}, {
        success: function() {
          self.displayAlert('alert-success', 'Congratulations!', 'The user has been created.');
        },
        error: function(err) {
          console.log(err);
          self.displayAlert('alert-danger', 'Error!', 'Something went wrong :/. Look at the logs.');
        }
      });

    },

    render: function() {
      this.$el.html(this.template({
        username: 'Username',
        password: 'Password',
        mail: 'Mail',
        title: 'New User',
        submit: 'Create'
      }));
      return this;
    }
  });

});
