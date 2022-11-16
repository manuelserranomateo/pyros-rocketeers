var mongoose = require('mongoose');

var User = require('./user');
var Product = require('./product');
var Order = require('./order');

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
                console.log(result);
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
                    if (!all && cartItem.qty > 1){
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

// to do
Model.getOrder = function (number, uid) {
    var user = this.getUserById(uid)
    if (user) {
        for (i = 0; i < user.orders.length; i++) {
            if (user.orders[i].number == number) {
                return user.orders[i];
            }
        }
    } else {
        return null;
    }
}

Model.getUserById = function (userid) {
    return User.findById(userid);
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

// to do
Model.purchase = function (uid, address, card_number, card_holder) {
    // var cartItemsTemp = [];
    // var user = Model.getUserById(uid);
    // var cart = Model.getCartByUserId(uid);

    // for (i = 0; i < cart.length; i++) {
    //     cartItemsTemp.push({
    //         'qty': cart[i].qty,
    //         'price': cart[i].product.price,
    //         'tax': cart[i].product.tax,
    //         'product': cart[i].product
    //     });
    // }

    // order = {
    //     'number': Date.now(),
    //     'date': new Date(),
    //     'address': address,
    //     'card_number': card_number,
    //     'card_holder': card_holder,
    //     'orderItems': cartItemsTemp,
    // }
    // user.orders.push(order);

    // len = cart.length;
    // for (i = 0; i < len; i++) {
    //     cart.pop();
    // }
    // return order

    return Promise.all([User.findById(uid)]).then(function (results) {
        var user = results[0];
        if (user && user.cartItems) {
            for (var i = 0; i < user.cartItems.length; i++){
                var cartItem = user.cartItems[i];
                var order = new Order({
                    'number': Date.now(),
                    'date': new Date(),
                    'address': address,
                    'cardHolder': card_holder,
                    'cardNumber': card_number,
                    'orderItems': [{
                        'qty': cartItem.qty,
                        'price': cartItem.product.price,
                        'tax': cartItem.product.tax,
                        'product': cartItem.product
                }]
                })
            }
            
            
            return order.save().then(function () {
                return user.orders;
            });
        }
        return null;
    }).catch(function (err) { console.error(err); return null; });
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

// to do
Model.getOrdersByUserId = function (uid) {
    var user = Model.getUserById(uid);
    if (user) {
        return user.orders;
    }
    return null;
}

Model.getProducts = function () {
    return Product.find();
}

module.exports = Model;
