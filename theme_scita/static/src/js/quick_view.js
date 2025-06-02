/** @odoo-module **/

import animation from "@website/js/content/snippets.animation";
import { rpc, RPCError } from '@web/core/network/rpc';
import { WebsiteSale } from "@website_sale/js/website_sale";
import wSaleUtils from "@website_sale/js/website_sale_utils";
import publicWidget from "@web/legacy/js/public/public_widget";
import VariantMixin from "@website_sale/js/sale_variant_mixin";
import { cartHandlerMixin } from '@website_sale/js/website_sale_utils';
import {extraMenuUpdateCallbacks} from "@website/js/content/menu";
import '@website_sale_wishlist/js/website_sale_wishlist';

odoo.define('theme_scita.quick_view',[], function(require) {
    'use strict';

    // For quickview Start
    publicWidget.registry.quickView = publicWidget.Widget.extend({
        selector: "#wrapwrap",
        events: {
            'click .quick_view_sct_btn': 'quickViewData',
            'click .cart_view_sct_btn': 'cartViewData',
            "click .css_attribute_color": "_onMouseEnterSwatch",
            // "click .css_attribute_color": "_onMouseLeave",
            
        },
        quickViewData: function(ev) {
            var element = ev.currentTarget;
            var product_id = $(element).attr('data-id');
            this.wishlistProductIDs = JSON.parse(sessionStorage.getItem('website_sale_wishlist_product_ids') || '[]');
            rpc('/theme_scita/shop/quick_view',{'product_id':product_id}).then(function(data) {
                var sale = new publicWidget.registry.WebsiteSale();

                    $("#shop_quick_view_modal").html(data);
                    $("#shop_quick_view_modal").modal('show');
                    var WebsiteSale = new publicWidget.registry.WebsiteSale();
                    var ProductWishlist = new publicWidget.registry.ProductWishlist();
                    WebsiteSale.init();
                    ProductWishlist.init();
                    var combination = [];
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


                    $("button.o_add_wishlist_dyn").on("click",function(ev){
                        this.wishlistProductIDs = JSON.parse(sessionStorage.getItem('website_sale_wishlist_product_ids') || '[]');
                        ProductWishlist._onClickAddWish(ev);
                        ProductWishlist._onChangeVariant(ev);
                    });


                    $(document).on('change', 'input[name="add_qty"]', function(ev){
                        WebsiteSale._onChangeAddQuantity(ev);
                    });
                    $( ".list-inline-item .css_attribute_color" ).change(function(ev) {
                        var $parent = $(ev.target).closest('.js_product');
                        $parent.find('.css_attribute_color').removeClass("active");
                        $parent.find('.css_attribute_color').filter(':has(input:checked)').addClass("active");
                    });
                return document.querySelector("#product_detail_main").dataset.image_layout;
            });
        },
        _onMouseEnterSwatch: function (ev) {
            const $swatch = $(ev.currentTarget);
            const $product = $swatch.closest('#product_detail');
            const $img = $product.find('img').first();      
            console.log("Swatch mouse enter event triggered", $swatch, $img);
            console.log($product,"<<<<<<<<<<<<<<<<<<< Product", );
            
                  
            // this.image= $img;
        
            this.defaultSrc = $img.attr('data-default-img-src');      
            console.log("Default image source:", this.defaultSrc);
            const previewSrc = $swatch.find('label').data('previewImgSrc');
            console.log("Preview image source:", previewSrc);

            // if (previewSrc) {
            //     this._updateImgSrc(previewSrc, $img);
            //     $swatch.addClass("active");
            // }
        },
        
        // _onMouseLeave: function () {
        //      this._updateImgSrc(this.defaultSrc,this.image);
        // },
        
        // _updateImgSrc: function (src, $img) {        
        //     if ($img && src) {
        //         $img.attr('src', src);
        //     } else {
        //         console.warn("Image element or source is missing.");
        //     }
        // },
        cartViewData: function(ev) {
            var element = ev.currentTarget;
            var product_id = $(element).attr('data-id');
            rpc('/theme_scita/shop/cart_view',{'product_id':product_id}).then(function(data) {
                $("#shop_cart_view_modal").html(data);
                $("#shop_cart_view_modal").modal('show');
            });
        },
    });
});;