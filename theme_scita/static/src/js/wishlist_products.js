odoo.define('theme_scita.wishlist_products', function (require) {
"use strict";
    var ajax = require('web.ajax');
    var publicWidget = require('web.public.widget');
    publicWidget.registry.toggle_wishlist = publicWidget.Widget.extend({
        selector: '#my_wish',
        events: {
            'click #wishlish_collapse': '_onClickShowMyWish',
            'click .wishlist-section .o_wish_rm': '_onClickWishProRemove',
        },
        _onClickShowMyWish: function (e) {
            var self = this;
            ajax.jsonRpc('/theme_scita/get_current_wishlist', 'call').then(function(data) {
                $('#show-wishlist').html(data);
            });
        },
        _onClickWishProRemove: function (e) {
            var tr = $(e.currentTarget).parents('tr');
            var $tbody = $(e.currentTarget).parents('tbody');
            var wish = tr.data('wish-id');
            var product = tr.data('product-id');
            var self = this;
            this._rpc({
                route: '/shop/wishlist/remove/' + wish,
            }).then(function () {
                location.reload(true);
            });

        },
    });
    publicWidget.registry.ProductWishlist.include({
        willStart: function () {
            var self = this;
            var def = this._super.apply(this, arguments);
            var wishDef;
            if ($('#top_menu .my_wish_quantity').length == 0 && this.wishlistProductIDs.length != +$('.my_wish_quantity').text()) {
                wishDef = $.get('/shop/wishlist', {
                    count: 1,
                }).then(function (res) {
                    self.wishlistProductIDs = JSON.parse(res);
                    sessionStorage.setItem('website_sale_wishlist_product_ids', res);
                });
            } else {
                return def;
            }
            return Promise.all([def, wishDef]);
        },
    });
});