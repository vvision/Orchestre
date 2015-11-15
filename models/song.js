var mongoose = require('mongoose');

//Mongo Models
//Should be compiled once
var songSchema = mongoose.Schema({
  fileName: String,
  title: {type: String, index: true},
  dir: String,
  rate: Number,
  trackNumber: Number,
  artist: String,
  album: String,
  albumId: String,
  genre: [String],
  type: String
});

var Song = mongoose.model('Song', songSchema);
