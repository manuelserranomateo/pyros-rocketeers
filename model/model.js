var mongoose = require('mongoose');

var User = require('./user');
var Product = require('./product');

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

Model.removeItem = function (uid, pid, all = false) {
    var user = Model.getUserById(uid);
    if (user) {
        for (var i = 0; i < user.cartItems.length; i++) {
            var item = user.cartItems[i];
            if (item.product._id == pid) {
                if (!all && (item.qty > 1)) {
                    item.qty--;
                } else {
                    user.cartItems.splice(i, 1);
                    Model.cartItems.splice(Model.cartItems.indexOf(item), 1);
                }
                return user.cartItems;
            }
        }
    }
    return null;
};

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

Model.addItem = function (uid, pid) { // all in promise is to wait for several promises
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
            // esto da un 500 cuando se añade un product nuevo, con el all y el array con un elemento se soluciona
            return Promise.all([user.save()]).then(function (result) {
                console.log(result);
                return result[0].cartItems;
            });
        }
        return null;
    }).catch(function (err) { console.error(err); return null; });
};

Model.purchase = function (uid, address, card_number, card_holder) {
    var cartItemsTemp = [];
    var user = Model.getUserById(uid);
    var cart = Model.getCartByUserId(uid);

    for (i = 0; i < cart.length; i++) {
        cartItemsTemp.push({
            'qty': cart[i].qty,
            'price': cart[i].product.price,
            'tax': cart[i].product.tax,
            'product': cart[i].product
        });
    }

    order = {
        'number': Date.now(),
        'date': new Date(),
        'address': address,
        'card_number': card_number,
        'card_holder': card_holder,
        'orderItems': cartItemsTemp,
    }
    user.orders.push(order);

    len = cart.length;
    for (i = 0; i < len; i++) {
        cart.pop();
    }
    return order
}

Model.getCartByUserId = function (uid) {
    return User.findById(uid).then(function (user) {
        if (user) {
            return user.cartItems;
        }
    })
}

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
