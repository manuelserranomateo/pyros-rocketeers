Model = {}

Model.products = [{
    _id: 0,
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
    _id: 1,
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
    _id: 2,
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
    _id: 3,
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
    _id: 4,
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
    _id: 5,
    title: 'Lamborghini Huracan STO',
    description: `The Lamborghini Huracán STO is a licensed DLC vehicle that was on sale as a bundle
    in the Item Shop for 2000 Credits from 04-21-2021 till
    04-27-2021.`,
    url: './images/lambo.jpg',
    price: 60,
    tax: 3
},
{
    _id: 6,
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
    _id: 7,
    title: 'Cyclone',
    description: `Cyclone is a Battle-Car released on July 30, 2018, which can only be obtained from the
    Zephyr Crate, and is classed as Import.
    Official artwork shows it with Grey Thread-X2 Wheels and the Sandstorm Rocket Boost.`,
    url: './images/cyclone.jpg',
    price: 80,
    tax: 1.4
}

];


Model._cartItemsCount = 3;
Model.cartItems = [{
    _id: 0,
    qty: 2,
    product: Model.products[0]
},
{
    _id: 1,
    qty: 7,
    product: Model.products[3]
},
{
    _id: 2,
    qty: 4,
    product: Model.products[5]
}
];

Model._usersCount = 1;
Model.users = [{
    _id: 0,
    email: 'gabricp@gmail.com',
    password: 'lamparita22',
    name: 'Gabriel',
    surname: 'Chilleron',
    birthdate: new Date("1977-12-30"),
    address: 'Calle Gracia N15',
    cartItems: [Model.cartItems[0], Model.cartItems[1], Model.cartItems[2]],
    orderItems: [],
    orders: []
}];

Model.signin = function (email, password) {
    Model.user = null;
    for (var i = 0; i < Model.users.length; i++) {
        if (Model.users[i].email == email && Model.users[i].password == password)
            Model.user = Model.users[i];
    }
    return Model.user;
}

Model.signout = function () {
    Model.user = null;
}

Model.signup = function (name, surname, address, birth, email, password) {
    Model.user = null;
    for (var i = 0; i < Model.users.length; i++) {
        if (Model.users[i].email == email) {
            return Model.user = null;
        } else {
            return Model.users.push({
                '_id': Model._usersCount++,
                'email': email,
                'password': password,
                'name': name,
                'surname': surname,
                'birthdate': new Date(birth),
                'address': address,
                'cartItems': [],
                'orderItems': [],
                'orders': [],
            }
            )
        }
    }
}

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
    for (var i = 0; i < Model.users.length; i++) {
        if (Model.users[i]._id == userid) {
            return Model.users[i];
        }
    }
    return null;
};

Model.getCartQty = function (uid) {
    var user = Model.getUserById(uid);
    if (user) {
        return user.cartItems.length;
    }
    return null;
};

Model.getProductById = function (pid) {
    for (var i = 0; i < Model.products.length; i++) {
        if (Model.products[i]._id == pid) {
            return Model.products[i];
        }
    }
    return null;
};

Model.addItem = function (uid, pid) {
    var product = Model.getProductById(pid);
    var user = Model.getUserById(uid);
    if (user && product) {
        for (var i = 0; i < user.cartItems.length; i++) {
            var cartItem = user.cartItems[i];
            if (cartItem.product._id == pid) {
                cartItem.qty++;
                return user.cartItems;
            }
        }
        var cartItem = {
            _id: Model._cartItemsCount++,
            product: product,
            qty: 1
        };
        user.cartItems.push(cartItem);
        Model.cartItems.push(cartItem);
        return user.cartItems;
    }
    return null;
};

Model.purchase = function (uid,address,card_number, card_holder ) {
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
    var user = Model.getUserById(uid);
    if (user) {
        return user.cartItems;
    }
    return null;
}

Model.getOrdersByUserId = function (uid) {
    var user = Model.getUserById(uid);
    if (user) {
        return user.orders;
    }
    return null;
}

module.exports = Model;
