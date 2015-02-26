define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/admin.html',
    'text!templates/alert.html'
  ], function($, Backbone, Hogan, AdminTemplate, AlertTemplate) {

  return Backbone.View.extend({
    initialize: function() {

    },

    events: {
      'click .scan': 'startScan'
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
      $('.msg').empty().append(Hogan.compile(AlertTemplate).render({
        alertType: alertType,
        strongText: strongText,
        message: message,
      }));
    },

    render: function() {
      this.$el.html(Hogan.compile(AdminTemplate).render({}));
      return this;
    }
  });
});
