// Import express module
var express = require('express');

// Import path module
var path = require('path');

// Import logger module
var logger = require('morgan');

var model = require('./model/model.js');

var cookieParser = require('cookie-parser');

// Instantiate the express middleware
var app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Load logger module
app.use(logger('dev'));

//Set public folder to publish static content
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/products', function (req, res, next) {
    return res.json(model.products);
});

app.post('/api/users/signin', function (req, res, next) {
    var user = model.signin(req.body.email, req.body.password);
    if (user) {
        res.cookie('uid', user._id);
        return res.json({});
    }
    return res.status(401).json({ message: 'Invalid credentials' });
});

app.get('/api/cart/qty', function (req, res, next) {
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    var cartQty = model.getCartQty(uid);
    if (cartQty !== null) {
        return res.json(cartQty);
    }
    return res.status(500).send({ message: 'Cannot retrieve user cart quantity' });
});

app.post('/api/cart/items/product/:pid', function (req, res, next) {
    var pid = req.params.pid;
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    var cart = Model.addItem(uid, pid);
    if (cart) {
        return res.json(cart);
    }
    return res.status(500).send({ message: 'Cannot add item to cart' });
});

app.get('/api/cart', function (req, res, next) {
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    var cart = Model.getCartByUserId(uid);
    if (cart) {
        return res.json(cart);
    }
    return res.status(500).send({ message: 'Cannot retrieve cart' });
});

app.delete('/api/cart/items/product/:id', function (req, res, next) {
    var pid = req.params.id;
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    var cart = Model.removeItem(uid, pid, false);
    if (cart) {
        return res.json(cart);
    }
    return res.status(500).send({ message: 'Cannot remove item from cart' });
});

app.delete('/api/cart/items/product/:id/all', function (req, res, next) {
    var pid = req.params.id;
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    var cart = Model.removeItem(uid, pid, true);
    if (cart) {
        return res.json(cart);
    }
    return res.status(500).send({ message: 'Cannot remove item from cart' });
});

app.post('/api/users/signup', function (req, res, next) {
    var newUser = model.signup(req.body.name, req.body.surname, req.body.address, req.body.birth, req.body.email, req.body.password);
    if (newUser){
        return res.json(newUser);
    }
    return res.status(500).json({ message: 'That email is already registered!' });
});

app.get('/api/users/profile', function (req, res, next){
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    profile = Model.getUserById(uid);

    return res.json(profile);
});

app.get('/api/orders', function (req, res, next) {
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    var order = Model.getOrdersByUserId(uid);
    if (order) {
        return res.json(order);
    }
    return res.status(500).send({ message: 'Cannot retrieve orders' });
});

app.post('/api/orders', function (req, res, next) {
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    var order = Model.purchase(uid, req.body.card_number,req.body.card_owner, req.body.address);
    if (order) {
        console.log(order);
        return res.json(order);
    }
    return res.status(500).send({ message: 'Cannot order' });
});

app.get('/api/orders/id/:oid', function (req, res, next){
    var oid = req.params.oid
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    var order = Model.getOrder(oid,uid);
    if (order) {
        return res.json(order);
    }
    return res.status(500).send({ message: 'Cannot retrieve orders' });

})

// Adds the / route to the application
// Set redirection to index.html
app.get(/\/.*/, function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Listen to port 3000
app.listen(3000, function () {
    console.log('Pyros Rocketeers listening on port 3000!');
});
