define([
  'jquery',
  'backbone',
  'handlebars',
  'text!templates/admin.html',
  'text!templates/alert.html'
], function($, Backbone, Handlebars, AdminTemplate, AlertTemplate) {

  return Backbone.View.extend({
    template: Handlebars.compile(AdminTemplate),

    initialize: function() {

    },

    events: {
      'click .scan': 'startScan',
      'click .artists-desc-update': 'updateDesc',
      'click .artists-thumb-update': 'updateThumb',
      'click .albums-cover-update': 'updateCover'
    },

    updateCover: function() {
      var self = this;
      console.log('Update cover');
      $.ajax({
        url: '/albums/scan',
        type: 'GET',
        success: function () {
          self.displayAlert('alert-success', 'Success!', 'Albums cover imported.');
        },
        error: function(err) {
          console.log(err);
          self.displayAlert('alert-danger', 'Error!', 'Something went wrong while importing covers. Check the logs.');
        }
      });
    },

    updateThumb: function() {
      var self = this;
      console.log('Update thumb');
      $.ajax({
        url: '/artists/importThumb',
        type: 'GET',
        success: function () {
          self.displayAlert('alert-success', 'Success!', 'Artists thumbnail imported.');
        },
        error: function(err) {
          console.log(err);
          self.displayAlert('alert-danger', 'Error!', 'Something went wrong while importing thumbnail. Check the logs.');
        }
      });
    },

    updateDesc: function() {
      var self = this;
      console.log('Update desc');
      $.ajax({
        url: '/artists/importDesc',
        type: 'GET',
        success: function () {
          self.displayAlert('alert-success', 'Success!', 'Artists description imported.');
        },
        error: function(err) {
          console.log(err);
          self.displayAlert('alert-danger', 'Error!', 'Something went wrong while importing descriptions. Check the logs.');
        }
      });
    },

    startScan: function() {
      var self = this;
      console.log('scan');
      $.ajax({
        url: '/scan',
        type: 'GET',
        success: function () {
          self.displayAlert('alert-success', 'Success!', 'Songs imported.');
        },
        error: function(err) {
          console.log(err);
          self.displayAlert('alert-danger', 'Error!', 'Something went wrong while importing songs. Check the logs.');
        }
      });
    },

    displayAlert: function(alertType, strongText, message) {
      $('.msg').empty().append(Handlebars.compile(AlertTemplate)({
        alertType: alertType,
        strongText: strongText,
        message: message
      }));
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });
});
