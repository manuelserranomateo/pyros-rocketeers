var mongoose = require('mongoose');

var schema = mongoose.Schema({
    number: { type: Number, required: true },
    date: { type: Date, required: true },
    address: { type: String, required: true },
    cardHolder: { type: String, required: true },
    cardNumber: { type: String, required: true },
    orderItems: {
        type: [{
            qty: { type: Number, required: true },
            price: { type: Number, required: true },
            tax: { type: Number, required: true },
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
        }]
    }
});

module.exports = mongoose.model('Order', schema);