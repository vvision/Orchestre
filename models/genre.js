var mongoose = require('mongoose');

var genreSchema = mongoose.Schema({
  name: String
});

var Genre = mongoose.model('Genre', genreSchema);
