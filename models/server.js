var mongoose = require('mongoose');

var serverSchema = mongoose.Schema({
  hostname: String,
  name: String,
  contact: String,
  added: { type: Date, 'default': Date.now },
  apiKey: String,
  enabled: String
});

var Server = mongoose.model('Server', serverSchema);
