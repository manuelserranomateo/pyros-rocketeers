var mongoose = require('mongoose');

var User = require('./user');

mongoose.Promise = global.Promise;

var uri = 'mongodb://127.0.0.1/pyros-rocketeers';
var db = mongoose.connection;

db.on('connecting', function () {
    console.log('Connecting to', uri);
});
db.on('connected', function () {
    console.log('Connected to', uri);
});
db.on('disconnecting', function () {
    console.log('Disconnecting from', uri);
});
db.on('disconnected', function () {
    console.log('Disconnected from', uri);
});
db.on('error', function (err) {
    console.error('Error:', err.message);
});

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(function () {
    var user = new User({
        email: 'gabricp@gmail.com',
        password: 'lamparita22',
        name: 'Gabriel',
        surname: 'Chilleron',
        birth: new Date("1977-12-30"),
        address: 'Calle Gracia N15'
    });
    return user.save().then(function (result) {
        console.log(result);
        return mongoose.disconnect();
    });
}).catch(function (err) {
    console.error('Error:', err.message);
});