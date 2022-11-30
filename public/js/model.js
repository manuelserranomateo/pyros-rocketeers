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

Model.getToken = function () {
    if (document.cookie) {
        var token = RegExp('token=[^;]+').exec(document.cookie);
        if (token) {
            token = decodeURIComponent(token[0].replace(/^[^=]+./, ""));
            return token;
        }
    }
    return null;
};

Model.signout = function () {
    document.cookie = 'token=;expires=0;path=/;'
};

Model.getCartQty = function () {
    return $.ajax({
        url: '/api/cart/qty',
        method: 'GET',
        beforeSend: function (xhr) {
            var token = Model.getToken();
            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
            }
        }
    });
};

Model.addItem = function (pid) {
    return $.ajax({
        url: '/api/cart/items/product/' + pid,
        method: 'POST',
        beforeSend: function (xhr) {
            var token = Model.getToken();
            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
            }
        }
    });
    
};

Model.getCart = function () {
    return $.ajax({
        url: '/api/cart',
        method: 'GET',
        beforeSend: function (xhr) {
            var token = Model.getToken();
            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
            }
        } 
    });
};

Model.removeItem = function (pid, all = false) {
    return $.ajax({
        url: '/api/cart/items/product/' + pid + (all ? '/all' : ''),
        method: 'DELETE',
        beforeSend: function (xhr) {
            var token = Model.getToken();
            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
            }
        } 
    });
};

Model.signup = function (name, surname, address, birth, email, password) {
    return $.ajax({
        url: '/api/users/signup',
        method: 'POST',
        data: { name, surname, address, birth, email, password }
    })
}

Model.getProfile = function () {
    return $.ajax({
        url: '/api/users/profile',
        method: 'GET',
        beforeSend: function (xhr) {
            var token = Model.getToken();
            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
            }
        } 
    })
}

Model.getOrder = function (oid) {
    return $.ajax({
        url: '/api/orders/id/' + oid,
        method: 'GET',
        beforeSend: function (xhr) {
            var token = Model.getToken();
            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
            }
        } 
    })
}

Model.purchase = function (card_number, card_owner, address) {
    return $.ajax({
        url: '/api/orders',
        method: 'POST',
        data: { card_number, card_owner, address },
        beforeSend: function (xhr) {
            var token = Model.getToken();
            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
            }
        } 
    })
}

Model.getOrdersByUserId = function () {
    return $.ajax({
        url: '/api/orders',
        method: 'GET'
    })
}