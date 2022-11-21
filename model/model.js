var mongoose = require('mongoose');

var User = require('./user');
var Product = require('./product');
var Order = require('./order');
var OrderItem = require('./orderItem');


Model = {}

Model.signin = function (email, password) {
    return User.findOne({ email, password });
};

Model.signout = function () {
    Model.user = null;
}

Model.signup = function (name, surname, address, birth, email, password) {
    return User.findOne({ email }).then(function (user) {
        if (!user) {
            var user = new User({
                email: email,
                password: password,
                name: name,
                surname: surname,
                birth: (new Date(birth)).getTime(),
                address: address,
                cartItems: []
            });
            return user.save();
        }
        return null;
    });
};

Model.addItem = function (uid, pid) {
    return Promise.all([User.findById(uid), Product.findById(pid)]).then(function (results) {
        var user = results[0];
        var product = results[1];
        if (user && product) {
            for (var i = 0; i < user.cartItems.length; i++) {
                var cartItem = user.cartItems[i];
                if (cartItem.product == pid) {
                    cartItem.qty++;
                    return user.save().then(function () {
                        return user.cartItems;
                    });
                }
            }
            user.cartItems.push({ qty: 1, product });
            return Promise.all([user.save()]).then(function (result) {
                return result[0].cartItems;
            });
        }
        return null;
    }).catch(function (err) { console.error(err); return null; });
};

Model.removeItem = function (uid, pid, all = false) {
    return Promise.all([User.findById(uid), Product.findById(pid)]).then(function (results) {
        var user = results[0];
        var product = results[1];
        if (user && product) {
            for (var i = 0; i < user.cartItems.length; i++) {
                var cartItem = user.cartItems[i];
                if (cartItem.product == pid) {
                    if (!all && cartItem.qty > 1) {
                        cartItem.qty--;
                    } else {
                        user.cartItems.splice(i, 1);
                    }
                    return user.save().then(function () {
                        return user.cartItems;
                    });
                }
            }
        }
        return null;
    }).catch(function (err) { console.error(err); return null; });
};

Model.getOrder = function (number, uid) {
    return User.findById(uid).populate({
        path: 'orders',
        populate: { path: 'orderItems', populate: 'product' }
    }).then(function (user){
        if (user){
            for (var i = 0; i < user.orders.length; i++){
                if (user.orders[i].number == number){
                    return user.orders[i];
                }
            }
        }
    })
}

Model.getUserById = function (userid) {
    return User.findById(userid).populate({
        path: 'orders',
        populate: { path: 'orderItems', populate: 'product' }
    });
};

Model.getCartQty = function (uid) {
    return User.findById(uid).then(function (user) {
        if (user) {
            return user.cartItems.length;
        }
    })
};

Model.getProductById = function (pid) {
    return Product.findById(pid).then(function (product) {
        if (!product) {
            return null;
        }
    });
};

Model.purchase = function (uid, address, card_number, card_holder) {
    return Promise.all([User.findById(uid).populate({
        path: 'cartItems',
        populate: 'product'
    })]).then(function (results) {
        var user = results[0];
        var orderItems = [];
        for (var i = 0; i < user.cartItems.length; i++) {
            let aux = user.cartItems[i];
            var orderItem = new OrderItem({
                'qty': aux.qty,
                'price': aux.product.price,
                'tax': aux.product.tax,
                'product': aux.product
            });
            orderItems.push(orderItem);
        }
        var order = new Order({
            'number': Date.now(),
            'date': new Date(),
            'address': address,
            'card_number': card_number,
            'card_holder': card_holder,
            'orderItems': orderItems
        })
        user.orders.push(order);

        len = user.cartItems.length;
        for (i = 0; i < len; i++) {
            user.cartItems.pop();
        }
        return Promise.all([OrderItem.insertMany(orderItems)]).then(function () {
            return order.save().then(function () {
                return user.save().then(function () {
                    return order;
                })
            })
        })
    })
}

Model.getCartByUserId = function (uid) {
    return User.findById(uid).populate({
        path: 'cartItems',
        populate: 'product'
    }).then(function (user) {
        if (user) {
            return user.cartItems;
        }
    })
}


Model.getOrdersByUserId = function (uid) {
    return User.findById(uid).populate({
        path: 'orders',
        populate: { path: 'orderItems', populate: 'product' }
    }).then(function (user) {
        if (user) {
            return user.orders;
        }
    })
}

Model.getProducts = function () {
    return Product.find();
}

module.exports = Model;
