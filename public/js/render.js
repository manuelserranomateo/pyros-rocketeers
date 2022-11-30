function render(url, container, context) {
    return $.ajax({
        url: url,
        method: 'GET'
    }).done(function (source) {
        var template = Handlebars.compile(source);
        var html = template(context);
        $(container).html(html);
    }).fail(function (error) {
        console.error('GET ', url, error);
    });
}
function navigateTo(event, url) {
    event.preventDefault();
    history.pushState(null, '', url);
    route();
}

function route() {
    var path = location.pathname;
    var matches = null;
    var templates = ['signin', 'cart', 'order', 'profile', 'signup', 'index', 'purchase'];
    console.log('ROUTING ', path);
    var context = { user: Model.getToken(), messages: { success: Messages.success, danger: Messages.danger } };
    Messages.clear();
    var cartQtyP = Model.getCartQty().done(function (cartQty) {
        context.cartQty = cartQty;
    }).fail(function () {
        console.error('Cannot retrieve cart quantity');
    });
    if (matches = path.match(/^\/$/)) {
        var productsP = Model.getProducts().done(function (products) {
            context.products = products;
        }).fail(function () {
            console.error('Cannot retrieve products');
        });
        $.when(cartQtyP, productsP).always(function () {
            render('/templates/index.hbs', '#content', context)
        });
    } else if (matches = path.match(/^\/order\/id\/([0-9^\/]+)\/?$/)) {
        var orderP = Model.getOrder(matches[1]).done(function (order) {
            context.order = order;
        }).fail(function () {
            $.when(cartQtyP, orderP).always(function () {
                render('/templates/not-found.hbs', '#content', context);
            });
        });
        $.when(cartQtyP, orderP).always(function () {
            render('/templates/order.hbs', '#content', context);
        });
    } else if (matches = path.match(/^\/cart\/?$/)) {
        var cartP = Model.getCart().done(function (cart) {
            context.cartItems = cart;
        }).fail(function () {
            console.error('Cannot retrieve cart');
        });
        $.when(cartQtyP, cartP).always(function () {
            render('/templates/cart.hbs', '#content', context);
        });
    }

    else if (matches = path.match(/^\/purchase\/?$/)) {
        var cartP = Model.getCart().done(function (cart) {
            context.cartItems = cart;
        }).fail(function () {
            console.error('Cannot retrieve cart');
        });
        $.when(cartQtyP, cartP).always(function () {
            render('/templates/purchase.hbs', '#content', context);
        });
    }
    else if (matches = path.match(/^\/profile\/?$/)) {
        var userP = Model.getProfile().done(function (profile) {
            context.userInfo = profile;
        }).fail(function () {
            console.error('Cannot retrieve profile');
        });
        var ordersP = Model.getOrdersByUserId().done(function (orders) {
            context.orders = orders;
        }).fail(function () {
            console.error('Cannot retrieve this users orders')
        });
        $.when(userP, ordersP, cartQtyP).always(function () {
            render('/templates/profile.hbs', '#content', context);
        });
    }
    else if ((matches = path.match(/^\/([^\/]*)\/?$/)) && templates.includes(matches[1])) {
        $.when(cartQtyP).always(function () {
            render('/templates/' + matches[1] + '.hbs', '#content', context);
        });
    }

    else {
        $.when(cartQtyP).always(function () {
            render('/templates/not-found.hbs', '#content', context);
        });
    }

}

function loadPartial(url, partial) {
    return $.ajax({
        url: url,
        method: 'GET'
    }).done(function (source) {
        Handlebars.registerPartial(partial, source);
    }).fail(function (error) {
        console.error('GET ', url, error);
    });
}

$(function () {
    Handlebars.registerHelper('formatPrice', function (price) {
        var result = '₹ ' + (Math.round(price * 100) / 100).toFixed(2);
        return new Handlebars.SafeString(result);
    });

    Handlebars.registerHelper('multiply', function (price, qty) {
        var result = price * qty;
        return new Handlebars.SafeString(result);
    });

    Handlebars.registerHelper('subtotal', function (cartItems) {
        let sum = 0;
        let aux = 0;
        for (i = 0; i < cartItems.length; i++) {
            aux = cartItems[i].qty * cartItems[i].product.price
            sum = sum + aux;
        }
        return new Handlebars.SafeString((Math.round(sum * 100) / 100).toFixed(2));
    });

    Handlebars.registerHelper('tax', function (cartItems) {
        let tax = 0;
        for (i = 0; i < cartItems.length; i++) {
            aux = cartItems[i].qty * cartItems[i].product.tax
            tax = tax + aux
        }
        return new Handlebars.SafeString((Math.round(tax * 100) / 100).toFixed(2));
    });

    Handlebars.registerHelper('total', function (cartItems) {
        let sum = 0;
        let total = 0;
        let aux = 0;
        for (i = 0; i < cartItems.length; i++) {
            aux = cartItems[i].qty * cartItems[i].product.price
            sum = aux + (cartItems[i].product.tax * cartItems[i].qty)
            total = total + sum;
        }
        return new Handlebars.SafeString((Math.round(total * 100) / 100).toFixed(2));
    });

    Handlebars.registerHelper('today', function () {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;

        return new Handlebars.SafeString(today);
    });

    Handlebars.registerHelper('formatDate', function (today) {
        var t = new Date(today);
        var dd = String(t.getDate()).padStart(2, '0');
        var mm = String(t.getMonth() + 1).padStart(2, '0');
        var yyyy = t.getFullYear();

        t = mm + '/' + dd + '/' + yyyy;

        return new Handlebars.SafeString(t);
    });

    window.addEventListener('popstate', (event) => route(), false);
    $.when(loadPartial('/partials/navbar.hbs', 'navbar'),
        loadPartial('/partials/header.hbs', 'header'),
        loadPartial('/partials/messages.hbs', 'messages'),
        loadPartial('/partials/footer.hbs', 'footer')
    ).always(function () {
        route();
    });
});