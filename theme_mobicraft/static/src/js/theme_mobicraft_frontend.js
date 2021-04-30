odoo.define('theme_mobicraft.theme_mobicraft_frontend_js', function(require) {
    'use strict';

    var animation = require('website.content.snippets.animation');
    var ajax = require('web.ajax');
    var core = require('web.core');
    var _t = core._t;

    animation.registry.theme_mobicraft_product_category_slider = animation.Class.extend({
        selector: ".oe_pro_cat_slider",
        disabledInEditableMode: false,
        start: function() {
            var self = this;
            if (this.editableMode) {
                var $cat_slider = $('#wrapwrap').find('.oe_pro_cat_slider');
                var cat_name = _t("Product/Category Slider")

                _.each($cat_slider, function (single){
                    $(single).empty().append('<div class="container">\
                                                <div class="row oe_our_slider">\
                                                    <div class="col-md-12">\
                                                        <div class="title-block">\
                                                            <h4 id="snippet-title" class="section-title style1">\
                                                                <span>'+ cat_name+'</span>\
                                                            </h4>\
                                                        </div>\
                                                    </div>\
                                                </div>\
                                            </div>')
                });
            }
            if (!this.editableMode) {
                var slider_type = self.$target.attr('data-prod-cat-slider-type');
                ajax.jsonRpc("/theme_mobicraft/pro_get_dynamic_slider", 'call', {
                    'slider-type': self.$target.attr('data-prod-cat-slider-type') || '',
                }).then(function(data) {
                    if (data) {
                        self.$target.empty();
                        self.$target.append(data);
                        $(".oe_pro_cat_slider").removeClass('o_hidden');

                        ajax.jsonRpc('/theme_mobicraft/pro_image_effect_config', 'call', {
                            'slider_type': slider_type
                        }).then(function(res) {
                            $('div#' + res.s_id).owlCarousel({
                                margin: 10,
                                responsiveClass: true,
                                items: res.counts,
                                autoPlay: res.auto_rotate && res.auto_play_time,
                                stopOnHover: true,
                                nav:true,
                                rtl: _t.database.parameters.direction === 'rtl',
                                loop: false,
                                rewind:true,
                                dots:false,
                                responsive: {
                                    0: {
                                        items: 1,
                                    },
                                    420: {
                                        items: 2,
                                    },
                                    768: {
                                        items: 3,
                                    },
                                    1000: {
                                        items: res.counts,
                                    },
                                    1500: {
                                        items: res.counts,
                                    },
                                },
                            });
                        });
                    }
                });
            }
        }
    });

    animation.registry.theme_mobicraft_brand_custom_slider = animation.Class.extend({
        selector: ".mobicraft_theme_brand_slider",
        disabledInEditableMode: false,
        start: function() {
            var self = this;
            if (this.editableMode) {
                var $brand_slider = $('#wrapwrap').find('.mobicraft_theme_brand_slider');
                var brand_slider =  _t("Our Brands")

                _.each($brand_slider, function (single){
                    $(single).empty().append('<div class="container">\
                                                <div class="row">\
                                                    <div class="col-md-12">\
                                                        <div class="title-block">\
                                                            <h4 id="snippet-title" class="section-title style1"><span>'+ brand_slider+'</span></h4>\
                                                        </div>\
                                                    </div>\
                                                </div>\
                                            </div>')
                });
            }
            if (!this.editableMode) {
                ajax.jsonRpc("/mobicraft_theme/get_brand_slider", 'call', {
                    'brand_count': self.$target.attr('data-brand-count') || 0,
                    'brand_label': self.$target.attr('data-brand-label') || '',
                }).then(function(data) {
                    if (data) {
                        self.$target.empty();
                        self.$target.append(data);
                        $(".mobicraft_theme_brand_slider").removeClass('o_hidden');
                        $('div#theme_mobicraft_brand_slider').owlCarousel({
                            margin: 10,
                            autoPlay: 9000,
                            stopOnHover: true,
                            loop: false,
                            rewind:true,
                            dots:false,
                            responsiveClass: true,
                            rtl: _t.database.parameters.direction === 'rtl',
                            responsive: {
                                0: {
                                    items: 1,
                                },
                                420: {
                                    items: 2,
                                },
                                768: {
                                    items: 4,
                                },
                                1000: {
                                    items: 6,
                                },
                                1500: {
                                    items: 6,
                                },
                            },
                        });
                    }
                });
            }
        }
    });

    animation.registry.theme_mobicraft_blog_custom_snippet = animation.Class.extend({
        selector: ".mobicraft_theme_blog_slider",
        disabledInEditableMode: false,
        start: function() {
            var self = this;
            if (this.editableMode) {
                var $blog_slider = $('#wrapwrap').find('.mobicraft_theme_blog_slider');
                var blog_name = _t("Blog post slider")

                _.each($blog_slider, function (single){
                    $(single).empty().append('<div class="container">\
                                                <div class="row">\
                                                    <div class="col-md-12">\
                                                        <div class="title-block">\
                                                            <h4 id="snippet-title" class="section-title style1"><span>'+ blog_name+'</span></h4>\
                                                        </div>\
                                                    </div>\
                                                </div>\
                                            </div>')
                });
            }
            if (!this.editableMode) {
                var slider_type = self.$target.attr('data-blog-slider-type');
                ajax.jsonRpc("/theme_mobicraft/blog_get_dynamic_slider", 'call',  {
                    'slider-type': self.$target.attr('data-blog-slider-type') || '',
                }).then(function(data) {
                    if (data) {
                        self.$target.empty();
                        self.$target.append(data);
                        $(".mobicraft_theme_blog_slider").removeClass('o_hidden');

                        ajax.jsonRpc('/theme_mobicraft/blog_image_effect_config', 'call', {
                            'slider_type': slider_type
                        }).then(function(res) {

                            $('div#' + res.s_id).owlCarousel({
                                margin: 10,
                                responsiveClass: true,
                                items: res.counts,
                                autoPlay: res.auto_rotate && res.auto_play_time,
                                stopOnHover: true,
                                nav:true,
                                rtl: _t.database.parameters.direction === 'rtl',
                                loop: false,
                                rewind:true,
                                dots:false,
                                responsive: {
                                    0: {
                                        items: 1,
                                    },
                                    420: {
                                        items: 2,
                                    },
                                    768: {
                                        items: res.counts,
                                    },
                                    1000: {
                                        items: res.counts,
                                    },
                                    1500: {
                                        items: res.counts,
                                    }
                                },
                            });
                        });

                    }
                });
            }
        }
    });

    animation.registry.theme_mobicraft_multi_cat_custom_snippet = animation.Class.extend({
        selector: ".oe_multi_category_slider",
        disabledInEditableMode: false,
        start: function() {
            var self = this;
            if (this.editableMode) {
                var $multi_cat_slider = $('#wrapwrap').find('.oe_multi_category_slider');
                var multi_cat_name = _t("Multi Category Slider")

                _.each($multi_cat_slider, function (single){
                    $(single).empty().append('<div class="container">\
                                                <div class="row our-categories">\
                                                    <div class="col-md-12">\
                                                        <div class="title-block">\
                                                            <h4 id="snippet-title" class="section-title style1"><span>'+ multi_cat_name+'</span></h4>\
                                                        </div>\
                                                    </div>\
                                                </div>\
                                            </div>')
                });
            }
            if (!this.editableMode) {
                var slider_type = self.$target.attr('data-multi-cat-slider-type');
                ajax.jsonRpc("/theme_mobicraft/product_multi_get_dynamic_slider", 'call', {
                    'slider-type': self.$target.attr('data-multi-cat-slider-type') || '',
                }).then(function(data) {
                    if (data) {
                        self.$target.empty();
                        self.$target.append(data);
                        $(".oe_multi_category_slider").removeClass('o_hidden');

                        ajax.jsonRpc('/theme_mobicraft/product_multi_image_effect_config', 'call', {
                            'slider_type': slider_type,
                        }).then(function(res) {
                            $('.multi_hide .owl-carousel').owlCarousel({
                                margin: 10,
                                responsiveClass: true,
                                items: 4,
                                autoPlay: res.sliding_speed,
                                stopOnHover: true,
                                nav:true,
                                rtl: _t.database.parameters.direction === 'rtl',
                                dots:false,
                                loop: false,
                                rewind:true,
                                responsive: {
                                    0: {
                                        items: 1,
                                    },
                                    420: {
                                        items: 2,
                                    },
                                    767: {
                                        items: 3,
                                    },
                                    1000: {
                                        items: 4,
                                    },
                                    1500: {
                                        items: 4,
                                    },
                                },
                            });
                        });

                    }
                });
            }
        }
    });

    animation.registry.theme_mobicraft_category_slider = animation.Class.extend({
        selector: ".oe_cat_slider",
        disabledInEditableMode: false,
        start: function() {
            var self = this;
            if (this.editableMode) {
                var $client_slider = $('#wrapwrap').find('#theme_mobicraft_custom_category_slider');
                var cat_name = _t("Category Slider")

                _.each($client_slider, function (single){
                    $(single).empty().append('<div class="container">\
                                                    <div class="row our-categories">\
                                                        <div class="col-md-12">\
                                                            <div class="title-block">\
                                                                <h4 class="section-title style1">\
                                                                    <span>' + cat_name + '</span>\
                                                                </h4>\
                                                            </div>\
                                                        </div>\
                                                    </div>\
                                                </div>')
                });
            }
            if (!this.editableMode) {
                var slider_id = self.$target.attr('data-cat-slider-id');
                ajax.jsonRpc("/theme_mobicraft/category_get_dynamic_slider", 'call', {
                    'slider-id': self.$target.attr('data-cat-slider-id') || '',
                }).then(function(data) {
                    if (data) {
                        self.$target.empty();
                        self.$target.append(data);
                        $(".oe_cat_slider").removeClass('o_hidden');

                        ajax.jsonRpc('/theme_mobicraft/category_image_effect_config', 'call', {
                            'slider_id': slider_id,
                        }).then(function(res) {
                            $('div#' + res.s_id).owlCarousel({
                                margin: 10,
                                responsiveClass: true,
                                nav:true,
                                loop: false,
                                rewind:true,
                                dots:false,
                                items: res.counts,
                                autoPlay: res.auto_rotate && res.auto_play_time,
                                rtl: _t.database.parameters.direction === 'rtl',
                                stopOnHover: true,
                                responsive: {
                                    0: {
                                        items: 1,
                                    },
                                    420: {
                                        items: 2,
                                    },
                                    768: {
                                        items: 3,
                                    },
                                    1000: {
                                        items: res.counts,
                                    },
                                    1500: {
                                        items: res.counts,
                                    },
                                },
                            });
                        });
                    }
                });
            }
        }
    });

    animation.registry.theme_mobicraft_featured_product_slider = animation.Class.extend({
        selector: ".oe_featured_prod_slider",
        disabledInEditableMode: false,
        start: function() {
            var self = this;
            if (this.editableMode) {
                $('div#div_theme_mobicraft_custom_featured_product_theme').empty();
            }
            if (!this.editableMode) {
                var slider_id = self.$target.attr('data-featured_prod-slider-id');
                ajax.jsonRpc("/theme_mobicraft/featured_product_get_dynamic_slider", 'call', {
                    'slider-id': self.$target.attr('data-featured-prod-slider-id') || '',
                }).then(function(data) {
                    if (data) {
                        self.$target.empty();
                        self.$target.append(data);
                        $(".oe_featured_prod_slider").removeClass('o_hidden');
                    }
                });
            }
        }
    });

});