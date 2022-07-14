odoo.define('theme_scita.quick_view', function(require) {
    'use strict';

    var sAnimations = require('website.content.snippets.animation');
    var publicWidget = require('web.public.widget');
    var ajax = require('web.ajax');
    var rpc = require('web.rpc');
    var wSaleUtils = require('website_sale.utils');
    var WebsiteSale = publicWidget.registry.WebsiteSale;
    // var productDetail = new publicWidget.registry.productDetail();
    var core = require('web.core');
    var QWeb = core.qweb;
    var core = require('web.core');
    var config = require('web.config');
    var VariantMixin = require('website_sale.VariantMixin');
    const cartHandlerMixin = wSaleUtils.cartHandlerMixin;
    require("web.zoomodoo");
    const {extraMenuUpdateCallbacks} = require('website.content.menu');
    const dom = require('web.dom');
    var xml_load = ajax.loadXML(
        '/website_sale_stock/static/src/xml/website_sale_stock_product_availability.xml',
        QWeb
    );

    // For quickview Start
    publicWidget.registry.quickView = publicWidget.Widget.extend({
        selector: "#wrapwrap",
        events: {
            'click .quick_view_sct_btn': 'quickViewData',
            'click .cart_view_sct_btn': 'cartViewData',
        },
        quickViewData: function(ev) {
            var element = ev.currentTarget;
            var product_id = $(element).attr('data-id');
            ajax.jsonRpc('/theme_scita/shop/quick_view', 'call',{'product_id':product_id}).then(function(data) {
                var sale = new publicWidget.registry.WebsiteSale();

                    $("#shop_quick_view_modal").html(data);
                    $("#shop_quick_view_modal").modal();
                    var WebsiteSale = new publicWidget.registry.WebsiteSale();
                    WebsiteSale.init();
                    var combination = [];
                    xml_load.then(function () {
                        var $message = $(QWeb.render(
                            'website_sale_stock.product_availability',
                            combination
                        ));
                        $('div.availability_messages').html($message);
                    });
                    $(".quick_cover").css("display", "block");
                    $("[data-attribute_exclusions]").on("change", function(ev) {
                        WebsiteSale.onChangeVariant(ev);
                    });
                    $("a.js_add_cart_json").on("click", function(ev) {
                        WebsiteSale._onClickAddCartJSON(ev);
                    });
                    $("a#add_to_cart").on("click", function(ev) {
                        $(this).closest('form').submit();
                    });
                    $(document).on('change', 'input[name="add_qty"]', function(ev){
                        WebsiteSale._onChangeAddQuantity(ev);
                    });
                    $( ".list-inline-item .css_attribute_color" ).change(function(ev) {
                        var $parent = $(ev.target).closest('.js_product');
                        $parent.find('.css_attribute_color').removeClass("active");
                        $parent.find('.css_attribute_color').filter(':has(input:checked)').addClass("active");
                    });
            });
        },
        cartViewData: function(ev) {
            var element = ev.currentTarget;
            var product_id = $(element).attr('data-id');
            ajax.jsonRpc('/theme_scita/shop/cart_view', 'call',{'product_id':product_id}).then(function(data) {
                $("#shop_cart_view_modal").html(data);
                $("#shop_cart_view_modal").modal();
            });
        }
    });
});;