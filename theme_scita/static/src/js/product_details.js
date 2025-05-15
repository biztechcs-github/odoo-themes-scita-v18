/** @odoo-module **/

import animation from "@website/js/content/snippets.animation";
import { _t } from "@web/core/l10n/translation";
import { rpc } from '@web/core/network/rpc';
import VariantMixin from "@website_sale/js/sale_variant_mixin";
import publicWidget from "@web/legacy/js/public/public_widget";
import wSaleUtils from "@website_sale/js/website_sale_utils";

odoo.define('theme_scita.scita_product_js', [], function () {
    "use strict";

    // Update image based on variant change
    VariantMixin._onChangeCombinationProd = function (ev, $parent, combination) {
        let product_id = 0;
        if ($parent.find('input.product_id:checked').length) {
            product_id = $parent.find('input.product_id:checked').val();
        } else {
            product_id = $parent.find('.product_id').val();
        }

        update_gallery_product_variant_image($parent, product_id);

        rpc("/shop/variant_change", { 'pro_id': product_id }).then(function (data) {
            if (data.is_default_code_disp && data.default_code) {
                const codeEl = $('.sct-default-code');
                if (codeEl.length) {
                    codeEl.html(data.default_code);
                } else {
                    $('.sct-sku-display-div').append('<p class="sct-sku-display">SKU: <span class="sct-default-code">' + data.default_code + '</span></p>');
                }
            } else {
                $('.sct-sku-display-div').empty();
            }
        });
    };

    function update_gallery_product_variant_image(event_source, product_id) {
        const $imgs = $('#gallery .item img');
        $imgs.each(function () {
            $(this).attr("src", "/web/image/product.product/" + product_id + "/image_1920");
        });
        $("img.js_variant_img_small").attr("src", "/web/image/product.product/" + product_id + "/image_1920");
    }

    $(document).ready(function () {
        // product detail page
        const sct_rtl = $('#wrapwrap').hasClass('o_rtl');
        $('div#recommended_products_slider').owlCarousel({
            margin: 20,
            responsiveClass: true,
            items: 4,
            rtl: sct_rtl,
            autoPlay: 7000,
            stopOnHover: true,
            navigation: true,
            responsive: {
                0: { items: 1 },
                500: { items: 2 },
                700: { items: 3 },
                1000: { items: 4 },
                1500: { items: 4 }
            }
        });
        // recommended_products_slider end
        //product detail page cart fix
        if ($('div').hasClass("sct-add-to-cart-mob")){
            $('#wrapwrap').addClass("sct-mobile-pro-detail-list");
        }
        if ($('#product_detail').length != 0) {
            $('body').addClass('sct-cst-pro-page');
        }
        // Product delivery location available checking start
        $('.checker').on('click', function(){
            var zip =  $('input.value-zip').val();
            rpc("/shop/zipcode", {
                'zip_code':zip
            }).then(function (data){
                if (data.status == true){
                    $('.get_status').removeClass("fail");
                    $('.get_status').addClass("success");
                    $('#fail_msg').addClass("o_hidden");
                    $('#success_msg').removeClass("o_hidden");
                    $('#blank_msg').addClass("o_hidden");
                    $('input.value-zip').val(zip);
                }
                if (data.status == false) {
                    $('input.value-zip').val(zip);
                    $('.get_status').removeClass("success");
                    $('.get_status').addClass("fail");
                    $('#fail_msg').removeClass("o_hidden");
                    $('#success_msg').addClass("o_hidden");
                    $('#blank_msg').addClass("o_hidden");
                }
                if(data.zip == "notavailable"){
                    $('input.value-zip').val(zip);
                    $('.get_status').removeClass("success");
                    $('.get_status').addClass("fail");
                    $('#fail_msg').addClass("o_hidden");
                    $('#success_msg').addClass("o_hidden");
                    $('#blank_msg').removeClass("o_hidden");
                }
             });
        });
    });
});

// ajax cart start
odoo.define('theme_scita.ajax_cart',[], function(require) {
    "use strict";
    var timeout;
    publicWidget.registry.WebsiteSale.include({
        _onChangeCombination: function (){
            if(this.el==undefined)
            {
                this.el = document.getElementById('product_detail');      
            }
            this._super.apply(this, arguments);
            VariantMixin._onChangeCombinationProd.apply(this, arguments);
        },
        async _onClickSubmit(ev, forceSubmit) {
            if ($(ev.currentTarget).is('#add_to_cart,.o_wsale_product_btn .a-submit') && !forceSubmit) {
                return;
            }
            if($("header .o_wsale_my_cart").hasClass('d-none'))
            {
                $("header .o_wsale_my_cart").removeClass('d-none');
                $("header .o_wsale_my_cart sup.my_cart_quantity").removeClass('d-none');
            }
            var $aSubmit = $(ev.currentTarget);
            if (!ev.isDefaultPrevented() && !$aSubmit.is(".disabled")) {
                ev.preventDefault();
                if ($aSubmit.parents('.ajax_cart_template').length) {
                    var frm = $aSubmit.closest('form');
                    var product_product = frm.find('input[name="product_id"]').val();
                    var quantity = frm.find('.quantity').val();
                    if(!quantity) {
                       quantity = 1;
                    }
                    const data = await rpc("/shop/cart/update_json", {
                        product_id: parseInt(product_product),
                        add_qty: quantity || 1,
                        display: false,
                    });
                    wSaleUtils.updateCartNavBar(data);
                } else {
                    $aSubmit.closest('form').submit();
                }
            }
            if ($aSubmit.hasClass('a-submit-disable')){
                $aSubmit.addClass("disabled");
            }
            if ($aSubmit.hasClass('a-submit-loading')){
                var loading = '<span class="fa fa-cog fa-spin"/>';
                var fa_span = $aSubmit.find('span[class*="fa"]');
                if (fa_span.length){
                    fa_span.replaceWith(loading);
                } else {
                    $aSubmit.append(loading);
                }
            }
        },
    });
});