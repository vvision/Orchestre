define([
  'jquery',
  'backbone',
  'handlebars',
  'text!templates/header/navbar.html',
  'text!templates/header/loginMenu.html',
  'text!templates/header/userMenu.html',
  'text!templates/header/adminMenu.html',
  'text!templates/header/authMenu.html'
], function($, Backbone, Handlebars, NavbarTemplate, LoginMenuTemplate, UserMenuTemplate, AdminMenuTemplate, AuthMenuTemplate) {

  return Backbone.View.extend({
    template: Handlebars.compile(NavbarTemplate),

    initialize: function(options) {
      this.user = options.user;
      this.user.on('change', this.renderUserMenu, this);

      if(this.user.get('username') == null) {
        var self = this;
        $.ajax({
          url: '/auth/status',
          type: 'GET',
          success: function(user) {
            self.user.set(user);
          },
          error: function(err) {
            console.log(err);
          }
        });
      }
    },

    events: {},

    renderUserMenu: function() {
      console.log(this.user);
      if(this.user.get('role') && this.user.get('role') != null) {
        $('.authMenu').html(Handlebars.compile(AuthMenuTemplate)());

        if(this.user.get('role') === 'admin') {
          $('.userMenu').html(Handlebars.compile(AdminMenuTemplate)({
            username: this.user.get('username')
          }));
        } else {
          $('.userMenu').html(Handlebars.compile(UserMenuTemplate)({
            username: this.user.get('username')
          }));
        }
      } else {
        $('.authMenu').empty();
        $('.userMenu').html(Handlebars.compile(LoginMenuTemplate)());
      }
    },

    render: function() {
      this.$el.html(this.template());

      $('.authMenu', this.$el).empty();
      $('.userMenu', this.$el).html(Handlebars.compile(LoginMenuTemplate)());
      return this;
    }
  });

});
