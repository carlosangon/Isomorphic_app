var mongoose = require('mongoose');

var schema = mongoose.Schema({
  title: {type: String, default: "", trim: true, required: 'A title is required' },
  body: {type: String, default: "", trim: true, required: 'A post body is required',},
  author: Number
});


var Post = mongoose.model('posts', schema);

module.exports = Post;
