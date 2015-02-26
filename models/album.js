var mongoose = require('mongoose');

var albumSchema = mongoose.Schema({
  name: {type: String, index: 'true'},
  year: Number,
  artist: String
});

var Album = mongoose.model('Album', albumSchema);
