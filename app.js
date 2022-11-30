// Import mongoose
var mongoose = require('mongoose');

// Import bcryptjs, and passport and its strategies
var passport = require('passport');
var passportJwt = require('passport-jwt');
var JwtStrategy = passportJwt.Strategy;
var ExtractJwt = passportJwt.ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;
var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('./model/user.js');

const secretKey = 'esunsecretodetumiradaylamiaunpresentimientocomounangelquemedecia...';

// Instantiate MongoDB connection
const uri = 'mongodb://127.0.0.1/pyros-rocketeers';
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('connecting', function () { console.log('Connecting to', uri); });
db.on('connected', function () { console.log('Connected to', uri); });
db.on('disconnecting', function () { console.log('Disconnecting from', uri); });
db.on('disconnected', function () { console.log('Disconnected from', uri); });
db.on('error', function (err) { console.error('Error:', err.message); });
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
    function (email, password, cb) {
        return User.findOne({ email }).select('email password name surname').then(function (user) {
            if (!user) {
                return cb({ message: 'Email not found' }, false);
            }
            if (!bcryptjs.compareSync(password, user.password)) {
                return cb({ message: 'Incorrect password' }, false);
            }
            return cb(null, user);
        }).catch(function (err) { cb(err) });
    }
));
passport.use(new JwtStrategy({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: secretKey },
    function (jwtPayload, cb) {
        return cb(null, { _id: jwtPayload.id });
    }
));

function uidFromToken(req, res) {
    if (req.user) {
        res.cookie('token', jwt.sign({ id: req.user._id }, secretKey, { expiresIn: 20 }), { expires: new Date(Date.now() + 20000) });
        return req.user._id;
    } else {
        res.clearCookie('token');
        return null;
    }
}

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
    return passport.authenticate('local', { session: false }, function (err, user, info) {
        if (err || !user) {
            console.error(err, user);
            return res.status(401).json(err);
        }
        return req.logIn(user, { session: false }, function (err) {
            if (err) {
                res.status(401).send(err);
            }
            uidFromToken(req, res);
            return res.json(user);
        });
    })(req, res, next);
});

app.get('/api/cart/qty', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var uid = uidFromToken(req, res);
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    } else {
        return model.getCartQty(uid).then(function (qty) {
            return res.json(qty);
        });
    }
});

app.post('/api/cart/items/product/:pid', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var uid = uidFromToken(req, res);
    var pid = req.params.pid;
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

app.get('/api/cart', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var uid = uidFromToken(req, res);
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    return Model.getCartByUserId(uid).then(function (cart) {
        if (cart) {
            return res.json(cart);
        }
        return res.status(500).send({ message: 'Cannot retrieve cart' });
    })
});

app.delete('/api/cart/items/product/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var uid = uidFromToken(req, res);
    var pid = req.params.id;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    return Model.removeItem(uid, pid, false).then(function (cart) {
        if (cart) {
            return res.json(cart);
        }
        return res.status(500).send({ message: 'Cannot remove item from cart' });
    })

});

app.delete('/api/cart/items/product/:id/all', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var uid = uidFromToken(req, res);
    var pid = req.params.id;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    return Model.removeItem(uid, pid, true).then(function (cart) {
        if (cart) {
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

app.get('/api/users/profile', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var uid = uidFromToken(req, res); 
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    return Model.getUserById(uid).then(function (profile) {
        return res.json(profile);
    });
});


app.get('/api/orders', function (req, res, next) {
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    return Model.getOrdersByUserId(uid).then(function (order) {
        if (order) {
            return res.json(order);
        }
        return res.status(500).send({ message: 'Cannot retrieve orders' });
    });

});

app.post('/api/orders', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var uid = uidFromToken(req, res); 
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    return Model.purchase(uid, req.body.card_number, req.body.card_owner, req.body.address).then(function (order) {
        if (order) {
            return res.json(order);
        }
        return res.status(500).send({ message: 'Cannot order' });
    })
});

app.get('/api/orders/id/:oid', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var uid = uidFromToken(req, res); 
    var oid = req.params.oid
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    return Model.getOrder(oid, uid).then(function (order) {
        if (order) {
            return res.json(order);
        }
        return res.status(500).send({ message: 'Cannot retrieve orders' });

    });

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
