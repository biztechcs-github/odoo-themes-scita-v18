/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";
import { WebsiteSale } from '@website_sale/js/website_sale';
import { _t } from "@web/core/l10n/translation";
import { rpc } from "@web/core/network/rpc";

var ppg = $('.o_wsale_products_grid_table_wrapper > table').attr('data-ppg');
const initialppg = ppg;
var count = $("tr").find(".oe_product").length;

publicWidget.registry.LazyLoadButton = WebsiteSale.extend({
    selector: '.s_ajax_load_btn',
    events: {
        'click': '_onClickLazyLoad',
    },

    init: function () {
        this.product_grid = document.querySelector('#o_wsale_products_grid');
        this.ppg = parseInt(this.product_grid?.getAttribute('data-ppg'));
        this.product_count = this.product_grid?.querySelectorAll('.oe_product').length;
        this.offset = 0;
        return this._super.apply(this, arguments);
    },

    start: function () {
        if (this.ppg === this.product_count) {
            document.querySelector('.s_ajax_load_btn').classList.remove('d-none');
        }
        return this._super.apply(this, arguments);
    },

    _onClickLazyLoad: function (ev) {
        this.offset = this.offset + this.ppg;
        let category = 0;
        let attributes = [];
        if ($(".selected_filters .selected_category").length) {
            category = $(".selected_filters .selected_category").attr("data-index");
        }

        if ($(".selected_filters .attributes").length) {
            attributes = $(".selected_filters .attributes .attrib_list").attr("data-list");
        }
        else {
            attributes = null;
        }

        let url = new URL(window.location.href)
        let search = url.searchParams.get('search') ? url.searchParams.get('search') : ""
        let order = url.searchParams.get('order') ? url.searchParams.get('order') : "";
        let max_price = url.searchParams.get('max_price') ? parseFloat(url.searchParams.get('max_price')) : 0.0;
        let min_price = url.searchParams.get('min_price') ? parseFloat(url.searchParams.get('min_price')) : 0.0;

        let self = this
        rpc('/lazy/load', {
                'search': search,
                'ppg': this.ppg,
                'offset': this.offset,
                'category_selected': category,
                'attributes': attributes,
                'initialppg': this.ppg,
                'order': order,
                'min_price': min_price,
                'max_price': max_price,
            }).then(function (data) {
            if (data) {
                let new_product_grid = document.createElement('div');
                new_product_grid.innerHTML = data.data_grid
                for (let node of new_product_grid.querySelectorAll('.oe_product')) {
                    self.product_grid.appendChild(node)
                }
                if (data.count < self.ppg) {
                    document.querySelector('.s_ajax_load_btn').classList.add('d-none');
                }
            }
        });
    },

});

export default publicWidget.registry.LazyLoadButton;
