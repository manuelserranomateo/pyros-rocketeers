// Import mongoose
var mongoose = require('mongoose');

// Instantiate MongoDB connection
const uri = 'mongodb://127.0.0.1/pyros-rocketeers';
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('connecting', function () { console.log('Connecting to', uri); });
db.on('connected', function () { console.log('Connected to', uri); });
db.on('disconnecting', function () { console.log('Disconnecting from', uri); });
db.on('disconnected', function () { console.log('Disconnected from', uri); });
db.on('error', function (err) { console.error('Error:', err.message); });
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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
    return model.getProducts().then(function (products) {
        if (products) {
            return res.json(products);
        }
        return res.status(500).json({ message: 'No products' });

    })
});

app.post('/api/users/signin', function (req, res, next) {
    return model.signin(req.body.email, req.body.password).then(function (user) {
        if (user) {
            res.cookie('uid', user._id);
            return res.json({});
        }
        return res.status(401).json({ message: 'Invalid credentials' });
    });
});

app.get('/api/cart/qty', function (req, res, next) {
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).json({ message: 'User has not signed in' });
    }
    return model.getCartQty(uid).then(function (qty) {
        if (qty > 0) {
            return res.json(qty);
        }
        return res.status(500).json({ message: 'Cannot retrieve user cart quantity' });
    });
});

app.post('/api/cart/items/product/:pid', function (req, res, next) {
    var pid = req.params.pid;
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).json({ message: 'User has not signed in' });
    }
    return Model.addItem(uid, pid).then(function (cart) {
        if (cart) {
            return res.json(cart);
        }
        return res.status(500).json({ message: 'Cannot add item to cart' });
    });
});

app.get('/api/cart', function (req, res, next) {
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    return Model.getCartByUserId(uid).then(function (cart){
        if (cart){
            return res.json(cart);
        }
        return res.status(500).send({ message: 'Cannot retrieve cart' });
    })
});

app.delete('/api/cart/items/product/:id', function (req, res, next) {
    var pid = req.params.id;
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    return Model.removeItem(uid, pid, false).then(function(cart){
        if (cart){
            return res.json(cart);
        }
        return res.status(500).send({ message: 'Cannot remove item from cart' });
    })

});

app.delete('/api/cart/items/product/:id/all', function (req, res, next) {
    var pid = req.params.id;
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    return Model.removeItem(uid, pid, true).then(function(cart){
        if (cart){
            return res.json(cart);
        }
        return res.status(500).send({ message: 'Cannot remove item from cart' });
    })
});

app.post('/api/users/signup', function (req, res, next) {
    return model.signup(req.body.name, req.body.surname, req.body.address, req.body.birth, req.body.email, req.body.password).then(function (user) {
        if (user) {
            return res.json(user._id);
        }
        return res.status(500).json({ message: 'Cannot create new user' });
    });
});

// to do
app.get('/api/users/profile', function (req, res, next) {
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    profile = Model.getUserById(uid);

    return res.json(profile);
});

// to do
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

// to do
app.post('/api/orders', function (req, res, next) {
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    var order = Model.purchase(uid, req.body.card_number, req.body.card_owner, req.body.address);
    if (order) {
        return res.json(order);
    }
    return res.status(500).send({ message: 'Cannot order' });
});

// to do
app.get('/api/orders/id/:oid', function (req, res, next) {
    var oid = req.params.oid
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    var order = Model.getOrder(oid, uid);
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
