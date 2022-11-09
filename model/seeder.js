var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


//Schemas
var User = require('./user');
var Product = require('./product');


var uri = 'mongodb://127.0.0.1/game-shop'; //hasta game-shop es el server, lo de despues es el nombre de la bbdd
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
    // var user = new User({
    //     email: 'johndoe@example.com',
    //     password: '1234',
    //     name: 'John',
    //     surname: 'Doe',
    //     birth: Date.UTC(1990, 0, 1),
    //     address: '123 Main St, 12345 New York, United States'
    // });
    //var cartItems = [new CartItem({ qty: 3, product: null }), new CartItem({ qty: 1, product: null })];
    var product = new Product({
        title: { },
        description: { },
        url: './images/octane.jpg',
        price: { },
        tax: { }
    })
    var user = new User({
        email: 'johndoe@example.com', password: '1234', name: 'John', surname: 'Doe', birth:
            Date.UTC(1990, 0, 1), address: '123 Main St, 12345 New York, United States',
        cartItems: [{ qty: 3, product: null }, { qty: 1, product: null }]
    });
    return User.deleteMany()
        .then(function () { return User.deleteMany(); })
        .then(function () { return user.save(); })
        .then(function () { return mongoose.disconnect(); });

    // return CartItem.deleteMany()
    //     .then(function () { return User.deleteMany(); })
    //     .then(function () { return cartItems[0].save(); })
    //     .then(function () { return cartItems[1].save(); })
    //     .then(function () { return user.save(); })
    //     .then(function () {
    //         console.log('user', user);
    //         return User.find({ email: 'johndoe@example.com' });
    //     }).then(function (result) {
    //         console.log('Non-populated user', result[0]);
    //         return User.find({ email: 'johndoe@example.com' }).populate('cartItems');
    //     }).then(function (result) {
    //         console.log('Populated user', result[0]);
    //         return mongoose.disconnect();
    //     });
    //return user.save().then(function (result) {  //Lo introduce en la base de datos  
    //return User.find().then(function (result) {   //Así busca todos
    //return User.findById(mongoose.Types.ObjectId("636bd0acca52534d4536cb9b")).then(function (result) { //Asi por id
    //return User.find({ email: 'johndoe@example.com'}).then(function (result) { //Así por el resto de att, pueden ser varios
    //return User.deleteOne({email:'johndoe@example.com'}).then(function (result) { //Así para borrar
    //return User.findOne({email:'johndoe@example.com'}).then(function (user) { //Ejemplo para encadenar operaciones(otra forma de borrar)
    //     return user.remove();
    //   }).then(function () {
    //     return User.find();
    //   }).then(function (result) { //hasta aqui esta parte de codigo de encadenar

    //     return User.findOne({ email: 'johndoe@example.com' }) //así para modificar atributos
    // }).then(function (user) {
    //     console.log('Pre:', user);
    //     user.password = 'admin2';
    //     return user.save();
    // }).then(function (result) {

    //     console.log(result);
    //     return mongoose.disconnect();
    // });
}).catch(function (err) {
    console.error('Error:', err.message);
});