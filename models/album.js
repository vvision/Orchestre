var mongoose = require('mongoose');

var albumSchema = mongoose.Schema({
  name: {type: String, index: 'true'},
  year: Number,
  artist: String,
  tracks: Number
});

mongoose.model('Album', albumSchema);
