odoo.define('theme_mobicraft.theme_mobicraft_js', function(require) {
    'use strict';

    var ajax = require('web.ajax');
    var VariantMixin = require('sale.VariantMixin');
    var sAnimations = require('website.content.snippets.animation');
    var api;
    // Dynamic cart update
    $(document).ready(function() {
        $('.oe_website_sale').each(function() {
            var oe_website_sale = this;
            var clickwatch = (function() {
                var timer = 0;
                return function(callback, ms) {
                    clearTimeout(timer);
                    timer = setTimeout(callback, ms);
                };
            })();

            $(oe_website_sale).on("change", ".oe_cart input.js_quantity[data-product-id]", function() {
                var $input = $(this);
                if ($input.data('update_change')) {
                    return;
                }
                var value = parseInt($input.val(), 10);
                var $dom = $(this).closest('tr');
                var $dom_optional = $dom.nextUntil(':not(.optional_product.info)');
                var line_id = parseInt($input.data('line-id'), 10);
                var product_id = parseInt($input.data('product-id'), 10);
                var product_ids = [product_id];
                clickwatch(function() {
                    $dom_optional.each(function() {
                        $(this).find('.js_quantity').text(value);
                        product_ids.push($(this).find('span[data-product-id]').data('product-id'));
                    });
                    $input.data('update_change', true);
                    ajax.jsonRpc("/shop/cart/update_json", 'call', {
                        'line_id': line_id,
                        'product_id': parseInt($input.data('product-id'), 10),
                        'set_qty': value
                    }).then(function(data) {
                        $input.data('update_change', false);
                        if (value !== parseInt($input.val(), 10)) {
                            $input.trigger('change');
                            return;
                        }
                        
                        if(data.cart_quantity == undefined){
                            data['cart_quantity'] = 0; 
                        }
                        
                        var $q1 = $(".mobicraft_theme_cart_quantity");
                        $q1.fadeOut(500)

                        var startTime = new Date().getTime();
                        var my_hover_total = setInterval(function(){
                            
                            if(new Date().getTime() - startTime > 1000){
                                clearInterval(my_hover_total);
                                $q1.html(data.cart_quantity).fadeIn(500);
                                return;
                            }
                            $("#mobicraft_hover_total").empty().html(data['theme_mobicraft.hover_total']);
                        }, 100);

                        my_hover_total;
                    });
                }, 500);

            });

            $(oe_website_sale).on('click', '.o_wish_add', function() {
                setTimeout(function(){
                    window.location.reload();
                }, 500)
            });

            $(oe_website_sale).on('change', 'input.js_product_change', function () {
                var self = this;
                var $parent = $(this).closest('.js_product');
                update_gallery_product_variant_image(this, +$(this).val());
            });

            $(oe_website_sale).on('change', 'input.js_variant_change, select.js_variant_change, ul[data-attribute_value_ids]', function(ev) {
                var $ul = $(ev.target).closest('.js_add_cart_variants');
                var $parent = $ul.closest('.js_product');
                var variant_ids = $ul.data("attribute_value_ids");
                var values = [];
                $parent.find('input.js_variant_change:checked, select.js_variant_change').each(function() {
                    values.push(+$(this).val());
                });

                var product_id = false;
                for (var k in variant_ids) {
                    if (_.isEmpty(_.difference(variant_ids[k][1], values))) {
                        product_id = variant_ids[k][0];
                        update_gallery_product_variant_image(this, product_id);
                        break;
                    }
                }
            });

        });

        // Multi image gallery
        ajax.jsonRpc('/theme_mobicraft/multi_image_effect_config', 'call', {})
            .then(function(res) {
                var dynamic_data = {}
                dynamic_data['gallery_images_preload_type'] = 'all'
                dynamic_data['slider_enable_text_panel'] = false
                dynamic_data['gallery_skin'] = "alexis"
                dynamic_data['gallery_height'] = 800
                dynamic_data['slider_scale_mode']='fit'
                if (res.theme_panel_position != false) {
                    dynamic_data['theme_panel_position'] = res.theme_panel_position
                }

                if (res.interval_play != false) {
                    dynamic_data['gallery_play_interval'] = res.interval_play
                }

                if (res.color_opt_thumbnail != false && res.color_opt_thumbnail != 'default') {
                    dynamic_data['thumb_image_overlay_effect'] = true
                    if (res.color_opt_thumbnail == 'b_n_w') {}
                    if (res.color_opt_thumbnail == 'blur') {
                        dynamic_data['thumb_image_overlay_type'] = "blur"
                    }
                    if (res.color_opt_thumbnail == 'sepia') {
                        dynamic_data['thumb_image_overlay_type'] = "sepia"
                    }
                }

                if (res.enable_disable_text == true) {
                    dynamic_data['slider_enable_text_panel'] = true
                }

                if (res.change_thumbnail_size == true) {
                    dynamic_data['thumb_height'] = res.thumb_height
                    dynamic_data['thumb_width'] = res.thumb_width
                }

                if (res.no_extra_options == false) {
                    dynamic_data['slider_enable_arrows'] = false
                    dynamic_data['slider_enable_progress_indicator'] = false
                    dynamic_data['slider_enable_play_button'] = false
                    dynamic_data['slider_enable_fullscreen_button'] = false
                    dynamic_data['slider_enable_zoom_panel'] = false
                    dynamic_data['slider_enable_text_panel'] = false
                    dynamic_data['strippanel_enable_handle'] = false
                    dynamic_data['gridpanel_enable_handle'] = false
                    dynamic_data['theme_panel_position'] = 'bottom'
                    dynamic_data['thumb_image_overlay_effect'] = false
                }

                api = $('#gallery').unitegallery(dynamic_data);
                api.on("item_change", function(num, data) {
                    if (data['index'] == 0) {
                        update_gallery_product_image();
                    }
                });

                if (api != undefined && $('#gallery').length != 0){
                    setTimeout(function(){
                        update_gallery_product_image()
                    }, 500);
                }
            });

        // Price slider code start
        var minval = $("input#m1").attr('value'),
            maxval = $('input#m2').attr('value'),
            minrange = $('input#ra1').attr('value'),
            maxrange = $('input#ra2').attr('value'),
            website_currency = $('input#mobicraft_theme_website_currency').attr('value');

        if (!minval) {
            minval = 0;
        }
        if (!maxval) {
            maxval = maxrange;
        }
        if (!minrange) {
            minrange = 0;

        }
        if (!maxrange) {
            maxrange = 2000;
        }

        $("div#priceslider").ionRangeSlider({
            keyboard: true,
            min: parseInt(minrange),
            max: parseInt(maxrange),
            type: 'double',
            from: minval,
            to: maxval,
            step: 1,
            prefix: website_currency,
            grid: true,
            onFinish: function(data) {
                $("input[name='min1']").attr('value', parseInt(data.from));
                $("input[name='max1']").attr('value', parseInt(data.to));
                $("div#priceslider").closest("form").submit();
            },
        });
        // Price slider code ends

        //attribute remove code
        $("a#clear").on('click', function() {
            var url = window.location.href.split("?");
            var lival = $(this).closest("label").attr('id');
            ajax.jsonRpc("/theme_mobicraft/removeattribute", 'call', {
                'attr_remove': lival
            }).then(function(data) {
                if (data == true) {
                    window.location.href = url[0];
                }
            })
        });

    });
    VariantMixin._onChangeCombinationProd = function (ev, $parent, combination) {
        var product_id = 0;

        // needed for list view of variants
        if ($parent.find('input.product_id:checked').length) {
            product_id = $parent.find('input.product_id:checked').val();
        } else {
            product_id = $parent.find('.product_id').val();
        }
        update_gallery_product_variant_image($parent, product_id);
        
    };
    function update_gallery_product_image() {
        var $container = $('.oe_website_sale').find('.ug-slide-wrapper');
        var $img = $container.find('img');
        var $product_container = $('.oe_website_sale').find('.js_product').first();
        var p_id = parseInt($product_container.find('input.product_id').first().val());

        if (p_id > 0) {
            $img.each(function(e_img) {
                if ($(this).attr("src").startsWith('/web/image/biztech.product.images/') == false) {
                    $(this).attr("src", "/web/image/product.product/" + p_id + "/image_1920");
                }
            });
        } else {
            var spare_link = api.getItem(0).urlThumb;
            $img.each(function(e_img) {
                if ($(this).attr("src").startsWith('/web/image/biztech.product.images/') == false) {
                    $(this).attr("src", spare_link);
                }
            });
        }
    }

    function update_gallery_product_variant_image(event_source, product_id) {
        var $imgs = $(event_source).closest('.oe_website_sale').find('.ug-slide-wrapper');
        var $img = $imgs.find('img');
        if (api!= undefined)
        {
            var total_img = api.getNumItems()
            if (total_img != undefined) {
                api.selectItem(0);
            }
            var $stay;
            $img.each(function(e) {
                if ($(this).attr("src").startsWith('/web/image/biztech.product.images/') == false) {
                    $(this).attr("src", "/web/image/product.product/" + product_id + "/image_1920");
                    $("img.product_detail_img").attr("src", "/web/image/product.product/" + product_id + "/image_1920");
                    $stay = $(this).parent().parent();
                    $(this).css({
                        'width': 'initial',
                        'height': 'initial'
                    });
                    api.resetZoom();
                    api.zoomIn();
                }
            });
        }
    }
    sAnimations.registry.WebsiteSale.include({
        _onChangeCombination: function (){
            this._super.apply(this, arguments);
            VariantMixin._onChangeCombinationProd.apply(this, arguments);
        }
    });
});
odoo.define('theme_mobicraft.cart_hover', function (require) {
'use strict';

    var publicWidget = require('web.public.widget');
    var rpc = require('web.rpc');
    var ajax = require('web.ajax');
    var core = require('web.core');
    var wSaleUtils = require('website_sale.utils');
    var timeout;

    publicWidget.registry.mobicraft_cart_popup = publicWidget.Widget.extend({
        selector: '#wrapwrap',
        init: function () {
            this._super.apply(this, arguments);
        },
        _onClickRemoveItem: function(ev) {
            $(ev.currentTarget).parent().siblings().find('.js_quantity').val(0).trigger('change');
        },
        _onUpdateQuantity: function(ev){
            /* Update the cart quantity and price while change the product quantity from input */
            ev.preventDefault();
            var $link = $(ev.currentTarget);
            var $input = $link.closest('.input-group').find("input");
            var min = parseFloat($input.data("min") || 0);
            var max = parseFloat($input.data("max") || Infinity);
            var previousQty = parseFloat($input.val() || 0, 10);
            var quantity = ($link.has(".fa-minus").length ? -1 : 1) + previousQty;
            var newQty = quantity > min ? (quantity < max ? quantity : max) : min;

            if (newQty !== previousQty) {
                $input.val(newQty).trigger('change');
            }
            return false;
        },
        _onChangeQuantity: function (ev){
            /* Get the updated data while change the cart quantity from cart. */
            var $input = $(ev.currentTarget);
            var self = this;
            $input.data('update_change', false);
            var value = parseInt($input.val() || 0, 10);
            if (isNaN(value)) {
                value = 1;
            }
            var line_id = parseInt($input.data('line-id'), 10);
            rpc.query({
                route: "/shop/cart/update_json",
                params: {
                    line_id: line_id,
                    product_id: parseInt($input.data('product-id'), 10),
                    set_qty: value
                },
            }).then(function (data) {
                $input.data('update_change', false);
                var check_value = parseInt($input.val() || 0, 10);
                if (isNaN(check_value)) {
                    check_value = 1;
                }
                if (value !== check_value) {
                    $input.trigger('change');
                    return;
                }
                if (!data.cart_quantity) {
                    return window.location = '/shop/cart';
                }
                wSaleUtils.updateCartNavBar(data);
                $input.val(data.quantity);
                $('.js_quantity[data-line-id='+line_id+']').val(data.quantity).html(data.quantity);
                $(".popover-header").html(data.quantity);
                $.get("/shop/cart", {
                    type: 'popover',
                }).then(function(data) {
                    $(".mycart-popover .popover-body").html(data);
                    $('.mycart-popover .js_add_cart_json').off('click').on('click',function(ev) {
                        ev.preventDefault();
                        self._onUpdateQuantity(ev)
                    });
                    $(".mycart-popover .js_quantity[data-product-id]").off('change').on('change',function(ev) {
                        ev.preventDefault();
                        self._onChangeQuantity(ev)
                    });
                    $(".mycart-popover .mobicraft_cart_popup_remove").off('click').on('click',function(ev) {
                        ev.preventDefault();
                        self._onClickRemoveItem(ev)
                    });
                });
            });
        }
    });
    publicWidget.registry.websiteSaleCartLink.include({
        selector: '.o_wsale_my_cart a[href$="/shop/cart"]',
        _onMouseEnter: function (ev) {
            var self = this;
            clearTimeout(timeout);
            $(this.selector).not(ev.currentTarget).popover('hide');
            timeout = setTimeout(function () {
                if (!self.$el.is(':hover') || $('.mycart-popover:visible').length) {
                    return;
                }
                self._popoverRPC = $.get("/shop/cart", {
                    type: 'popover',
                }).then(function (data) {
                    var cartPopup = new publicWidget.registry.mobicraft_cart_popup();
                    self.$el.data("bs.popover").config.content = data;
                    self.$el.popover("show");
                    $(".mycart-popover .popover-body").html(data);
                    $('.popover').on('mouseleave', function () {
                        self.$el.trigger('mouseleave');
                    });
                    $('.mycart-popover .js_add_cart_json').off('click').on('click',function(ev) {
                        ev.preventDefault();
                        cartPopup._onUpdateQuantity(ev)
                    });
                    $(".mycart-popover .js_quantity[data-product-id]").off('change').on('change',function(ev) {
                        ev.preventDefault();

                        cartPopup._onChangeQuantity(ev)
                    });
                    $(".mycart-popover .mobicraft_cart_popup_remove").off('click').on('click',function(ev) {
                        ev.preventDefault();
                        cartPopup._onClickRemoveItem(ev)
                    });
                });
            }, 300);
        }
    });
});