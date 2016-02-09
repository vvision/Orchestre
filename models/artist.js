var mongoose = require('mongoose');

var artistSchema = mongoose.Schema({
  name: {type: String, index: 'true'},
  desc: String,
  img: {type: Boolean, default: false}
});

mongoose.model('Artist', artistSchema);
