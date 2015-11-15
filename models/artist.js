var mongoose = require('mongoose');

var artistSchema = mongoose.Schema({
  name: {type: String, index: 'true'},
  desc: String,
  img: {type: Boolean, default: false}
});

var Artist = mongoose.model('Artist', artistSchema);
