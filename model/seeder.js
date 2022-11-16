var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


//Schemas
var User = require('./user');
var Product = require('./product');
var Order = require('./order');


var uri = 'mongodb://127.0.0.1/pyros-rocketeers'; //hasta game-shop es el server, lo de despues es el nombre de la bbdd
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
        address: 'Calle Gracia N15',
        cartItems: [],
        orders: []
    });

    return User.deleteMany()
        .then(function () { return user.save(); })
        .then(function () { return Product.deleteMany(); })
        .then(function () {
            return Product.insertMany([
                {
                    title: 'Octane',
                    description: `The Octane is a vehicle body released on July 7, 2015, along with
                the game release. It originally appeared in the Rocket League precursor Supersonic
                Acrobatic Rocket-Powered Battle-Cars. The Octane is classified as " Common" rarity.
                The Octane is one of the three bodies that can be unlocked at the beginning of the game.
                It has remained the most popular body in the game since Rocket League's release. It is
                by far the most popular with high ranked players and the most used by champion players
                during the Rocket League Championship Series.`,
                    url: './images/octane.jpg',
                    price: 10,
                    tax: 3.14
                }, {
                    title: 'Dominus',
                    description: `The Dominus is a vehicle released on August 13, 2015, which could only be obtained
                as DLC from the Supersonic Fury DLC Pack before it was made unlockable for free
                without purchase. The Dominus hitbox, used by other cars, is based off of it.
            
                It has remained the most popular premium body in the game since the first DLC's
                release as it is one of the most popular by high ranked players. It resembles a 1969
                Pontiac GTO.`,
                    url: './images/dominus.jpg',
                    price: 20,
                    tax: 2.75
                },
                {
                    title: 'Fennec',
                    description: `Fennec is a vehicle body that was released on July 1, 2019, which could be obtained
                from the Totally Awesome Crate. As of today, since Crates are retired, it can be
                obtained from Blueprints, Trade-ins or from Item Shop. It can also be obtained
                through trading between players.
                This car is among the most popular by high ranked players. Due to its popularity, on
                February 1, 2021, Fennec versions of the Esports Shop decals were released for all
                available teams.`,
                    url: './images/fennec.jpg',
                    price: 30,
                    tax: 1.5
                },
                {
                    title: '99 Nissan Skyline GT-R R34',
                    description: `The '99 Nissan Skyline GT-R R34 is a battle-car released as licensed DLC on October
                11, 2017. It was retired in December of 2019, but it made a return in the Fast
                & Furious Bundle.
            
                In the year or so following the Skyline's retirement, it became very sought after by
                Rocket League players, some even buying accounts with the Nissan Skyline on it,
                which is against Terms of Service. When the news hit that the Nissan Skyline was
                coming back, a lot of people were really happy to be able to get it again.`,
                    url: './images/skyline.jpg',
                    price: 40,
                    tax: 1.9
                },
                {
                    title: '007s Aston Martin Valhalla',
                    description: `The 007's Aston Martin Valhalla is a licensed vehicle that was on sale as a DLC
                bundle in the Item Shop for 1100 Credits from October 7 to
                October 13, 2021.
            
                Along with the Aston Martin Valhalla, the bundle includes a new Reel Life decal,
                unique wheels, and engine audio. These items are only compatible with the Aston
                Martin Valhalla, and cannot be equipped on other cars.`,
                    url: './images/astonmartin.jpg',
                    price: 50,
                    tax: 2.5
                },
                {
                    title: 'Lamborghini Huracan STO',
                    description: `The Lamborghini Huracán STO is a licensed DLC vehicle that was on sale as a bundle
                in the Item Shop for 2000 Credits from 04-21-2021 till
                04-27-2021.`,
                    url: './images/lambo.jpg',
                    price: 60,
                    tax: 3
                },
                {
                    title: 'McLaren 570S',
                    description: `The McLaren 570S is a vehicle body released on December 6, 2018 as licensed DLC.
                Before Patch v1.70, the McLaren could be obtained by purchasing it from the
                Showroom. In 2021, during Free To Play, a bundle featuring this car and some new
                items was re-released into the Item Shop on May 27th, 2021 for a limited time.`,
                    url: './images/mclaren.jpg',
                    price: 70,
                    tax: 2.1
                },
                {
                    title: 'Cyclone',
                    description: `Cyclone is a Battle-Car released on July 30, 2018, which can only be obtained from the
                Zephyr Crate, and is classed as Import.
                Official artwork shows it with Grey Thread-X2 Wheels and the Sandstorm Rocket Boost.`,
                    url: './images/cyclone.jpg',
                    price: 80,
                    tax: 1.4
                }
            ])
        })
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