/** @odoo-module **/
import publicWidget from "@web/legacy/js/public/public_widget";
import wSaleUtils from "@website_sale/js/website_sale_utils";
import { registry } from "@web/core/registry";
import { debounce } from "@web/core/utils/timing";
import { KeepLast } from "@web/core/utils/concurrency";
import { rpc } from "@web/core/network/rpc";

const WebsiteSale = publicWidget.registry.WebsiteSale;

publicWidget.registry.uploadPrintingFile = publicWidget.Widget.extend({
    selector: '.oe_website_sale_cart',
    events: {
        "change .js_quantity": "_onChangeQty",
        "click .sc-remove-line": "_onRemoveLine",
        "click .sc-clear-cart": "_onClearCart",
    },

    init: function () {
        this._super.apply(this, arguments);
        this._onChangeQty = debounce(this._onChangeQty, 200);
        this.dp = new KeepLast();
    },

    async _onChangeQty (ev) {
        const $target = $(ev.currentTarget);
        const qty = parseInt($target.val());
        const params = { product_id: $target.data("productId"), line_id: $target.data("lineId"), set_qty: qty };
        try {
            const data = await rpc("/shop/cart/update_json", params);
            this._refreshCart(data);
        } catch (error) {
            console.error("Failed to update cart quantity:", error);
        }
    },

    _onRemoveLine: function (ev) {
        ev.preventDefault();
        const lineId = ev.currentTarget.dataset.lineId;
        $(ev.currentTarget).closest('.input-group').find('.js_quantity').val(0).trigger("change");
        const lineEl = document.querySelector(`#scita_sidebar_line_${lineId}`);
        if (lineEl) {
            lineEl.remove();
        }
    },

     async _refreshCart (data) {
        data["cart_quantity"] = data.cart_quantity || 0;
        wSaleUtils.updateCartNavBar(data);
        if (data) {
            const totalEl = document.querySelector('.sc-cart-total');
            if (totalEl) totalEl.textContent = data.amount || '0.00';
        }
    },

});


publicWidget.registry.HeaderExtraMenuItems = publicWidget.Widget.extend({
    selector: 'header',
    events: {
        // 'click a#user_account': '_onCollapseShow',
        'click #user_account': '_onUserAccount',
        'click .o_extra_menu_items .dropdown': '_onMegamenuClick',
        'click .o_extra_menu_items':'_onClickExtraItem',
        'click li.li-mega-menu i.fa-chevron-right': '_onClickSliderRight',
        'click li.li-mega-menu i.fa-chevron-left': '_onClickSliderLeft',
    },
    _onUserAccount(event) {
        $('div.toggle-config').toggleClass("o_hidden");
    },
    _onMegamenuClick(event){
        event.stopPropagation();
        $(event.currentTarget).find('.dropdown-menu').slideToggle();
    },
    _onClickExtraItem(event){
        $(event.currentTarget).find('li .dropdown-menu').css('display','none');
    },
    _onClickSliderRight(event){
        event.stopImmediatePropagation();
    },
    _onClickSliderLeft(event){
        event.stopImmediatePropagation();
    }
});

publicWidget.registry.toggle_nav_menu = publicWidget.Widget.extend({
    selector: ".nav-items-icon",

    start() {
        this._showToggleMenu();
        return this._super.apply(this, arguments);
    },

    _showToggleMenu() {
        $('.nav-toggle-btn').on('click', function (e) {
            $('#cstm-nav-menu-toggle').removeClass("o_hidden");
            $('body').addClass('show-scita-cstm-menu');
        });

        $('#close_cstm_nav_toggle').on('click', function (e) {
            $('#cstm-nav-menu-toggle').addClass("o_hidden");
            $('body').removeClass('show-scita-cstm-menu');
        });
    },
});

$(document).ready(function() {
    var offset = 300,
    offset_opacity = 1200,
    scroll_top_duration = 700,
    $back_to_top = $('.cd-top');
    //hide or show the "back to top" link
    $('#wrapwrap').on('scroll',function() {
        ($(this).scrollTop() > offset) ? $back_to_top.addClass('cd-is-visible'): $back_to_top.removeClass('cd-is-visible cd-fade-out');
        if ($(this).scrollTop() > offset_opacity) {
            $back_to_top.addClass('cd-fade-out');
        }
    });
    $back_to_top.on('click', function(event) {
        event.preventDefault();
        $('body,html').animate({scrollTop: 0}, scroll_top_duration);
    });
});