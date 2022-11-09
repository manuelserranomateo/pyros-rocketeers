Model = {}

Model.getProducts = function () {
    return $.ajax({ url: '/api/products', method: 'GET' });
};

Model.signin = function (email, password) {
    return $.ajax({
        url: '/api/users/signin',
        method: 'POST',
        data: { email, password }
    });
};

Model.getUserId = function () {
    var uid = RegExp('uid=[^;]+').exec(document.cookie);
    if (uid) {
        uid = decodeURIComponent(uid[0].replace(/^[^=]+./, ""));
        return uid;
    }
    return null;
};

Model.signout = function () {
    document.cookie = 'uid=;expires=0;path=/;'
};

Model.getCartQty = function () {
    return $.ajax({
        url: '/api/cart/qty',
        method: 'GET'
    });
};

Model.addItem = function (pid) {
    return $.ajax({
        url: '/api/cart/items/product/' + pid,
        method: 'POST'
    });
};

Model.getCart = function () {
    return $.ajax({
        url: '/api/cart',
        method: 'GET'
    });
};

Model.removeItem = function (pid, all = false) {
    return $.ajax({
        url: '/api/cart/items/product/' + pid + (all ? '/all' : ''),
        method: 'DELETE'
    });
};

Model.signup = function (name, surname, address, birth, email, password){
    return $.ajax({
        url: '/api/users/signup',
        method: 'POST',
        data: { name, surname, address, birth, email, password }
    })
}

Model.getProfile = function (){
    return $.ajax({
        url: '/api/users/profile',
        method: 'GET'
    })
}

Model.getOrder = function (oid){
    return $.ajax({
        url: '/api/orders/id/'+oid,
        method: 'GET'
    })
}

Model.purchase = function (card_number,card_owner,address){
    return $.ajax({
        url: '/api/orders',
        method: 'POST',
        data: { card_number, card_owner, address }
    })
}

Model.getOrdersByUserId = function(){
    return $.ajax({
        url: '/api/orders',
        method: 'GET'
    })
}