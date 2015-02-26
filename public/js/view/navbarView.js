define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/header/navbar.html',
  'text!templates/header/loginMenu.html',
  'text!templates/header/userMenu.html',
  'text!templates/header/adminMenu.html',
  'text!templates/header/authMenu.html'
  ], function($, Backbone, Hogan, NavbarTemplate, LoginMenuTemplate, UserMenuTemplate, AdminMenuTemplate, AuthMenuTemplate) {

  return Backbone.View.extend({
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
        $('.authMenu').html(Hogan.compile(AuthMenuTemplate).render({}));

        if(this.user.get('role') === 'admin') {
          $('.userMenu').html(Hogan.compile(AdminMenuTemplate).render({
            username: this.user.get('username')
          }));
        } else {
          $('.userMenu').html(Hogan.compile(UserMenuTemplate).render({
            username: this.user.get('username')
          }));
        }
      } else {
        $('.authMenu').empty();
        $('.userMenu').html(Hogan.compile(LoginMenuTemplate).render({}));
      }
    },

    render: function() {
      this.$el.html(Hogan.compile(NavbarTemplate).render());

      $('.authMenu', this.$el).empty();
      $('.userMenu', this.$el).html(Hogan.compile(LoginMenuTemplate).render({}));
      return this;
    }
  });

});
