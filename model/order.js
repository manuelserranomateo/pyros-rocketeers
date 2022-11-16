var mongoose = require('mongoose');

var schema = mongoose.Schema({
    number:{type: Number, required: true},
    date:{type: Date, required: true},
    address:{type: String, required: true},
    card_number:{type: String, required: true},
    card_holder:{type: String, required: true},
    orderItems:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }]
})

module.exports = mongoose.model('Order', schema);