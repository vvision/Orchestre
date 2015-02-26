var mongoose = require('mongoose');

var artistSchema = mongoose.Schema({
  name: {type: String, index: 'true'}
});

var Artist = mongoose.model('Artist', artistSchema);
