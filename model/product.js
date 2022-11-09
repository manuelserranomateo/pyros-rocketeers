var mongoose = require('mongoose');

var schema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  price: { type: Double, required: true },
  tax: { type: Double, required: true }
});

module.exports = mongoose.model('Product', schema);