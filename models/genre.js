var mongoose = require('mongoose');

var genreSchema = mongoose.Schema({
  name: String
});

mongoose.model('Genre', genreSchema);
