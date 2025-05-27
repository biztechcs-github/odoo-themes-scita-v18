/** @odoo-module **/
import publicWidget from "@web/legacy/js/public/public_widget";
import wSaleUtils from "@website_sale/js/website_sale_utils";
import { registry } from "@web/core/registry";
import { debounce } from "@web/core/utils/timing";
import { KeepLast } from "@web/core/utils/concurrency";
import { rpc } from "@web/core/network/rpc";

const WebsiteSale = publicWidget.registry.WebsiteSale;

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

    async start() {
        await this._super.apply(this, arguments);
        this._bindDelegatedEvents();
        this._bindEvents();
    },

    _bindEvents() {
        const self = this;
        // Delegated event for quantity change
        $('body').off('change', '.js_quantity').on('change', '.js_quantity', debounce(async function(ev) {
            ev.preventDefault();
            await self._onChangeQty(ev);
        }, 200));

        // Delegated event for remove line click
        $('body').off('click', '.sc-remove-line').on('click', '.sc-remove-line', function(ev) {
            ev.preventDefault();
            self._onRemoveLine(ev);
        });

        $('body').off('click', '.js_add_cart_json').on('click', '.js_add_cart_json', async function(ev) {
            ev.preventDefault();
            const $btn = $(this);
            const $input = $btn.siblings('input.js_quantity');
            if (!$input.length) {
                console.warn('Quantity input not found near .js_add_cart_json button');
                return;
            }
            let currentQty = parseInt($input.val()) || 0;

            if ($btn.find('i.fa-minus').length) {
                currentQty = Math.max(0, currentQty - 1);
            } else if ($btn.find('i.fa-plus').length) {
                currentQty = currentQty + 1;
            }

            $input.val(currentQty).trigger('change');
        });
    },

    _bindDelegatedEvents() {
        const self = this;

        // Open cart sidebar
        $('body').off('click', '.nav-toggle-btn').on('click', '.nav-toggle-btn', async function(e) {
            e.preventDefault();
            $('#cstm-nav-menu-toggle').removeClass("o_hidden");
            $('body').addClass('show-scita-cstm-menu');
            self._reloadCartSidebar();
        });

        // Close cart sidebar
        $('body').off('click', '#close_cstm_nav_toggle').on('click', '#close_cstm_nav_toggle', function(e) {
            e.preventDefault();
            $('#cstm-nav-menu-toggle').addClass("o_hidden");
            $('body').removeClass('show-scita-cstm-menu');
        });
    },

    async _reloadCartSidebar() {
        try {
            const response = await rpc("/shop/cart/sidebar");
            const html = response.html;

            const cartContainer = document.querySelector('.cart_details');
            if (cartContainer) {
                const parent = cartContainer.parentElement;
                cartContainer.remove();
                parent.insertAdjacentHTML('beforeend', html);

                // Show the sidebar menu
                $('#cstm-nav-menu-toggle').removeClass("o_hidden");
                $('body').addClass('show-scita-cstm-menu');
            }
        } catch (err) {
            console.error("Failed to reload cart sidebar:", err);
        }
    },


    async _onChangeQty(ev) {
        const $target = $(ev.currentTarget);
        const qty = parseInt($target.val());
        const priceUnit = parseFloat($target.data("price-unit"));
        const currencyId = $target.data("currency-id");
        const params = {
            product_id: $target.data("productId"),
            line_id: $target.data("lineId"),
            set_qty: qty,
        };

        try {
            const data = await rpc("/shop/cart/update_json", params);
            this._refreshCart(data);
            this._reloadCartSidebar();
            if (data.cart_quantity === 0) {
                const cartContainer = document.querySelector('.sc_cart_lines');
                if (cartContainer) {
                    cartContainer.innerHTML = `
                        <div class="empty-cart-message text-center p-4">
                            <i class="fa fa-shopping-cart fa-3x mb-3 text-muted"></i>
                            <h5>Your cart is empty</h5>
                            <p>Looks like you haven’t added anything to your cart yet.</p>
                            <a href="/shop" class="btn btn-primary mt-2">Start Shopping</a>
                        </div>
                    `;
                }

                document.querySelector('.sc-cart-subtotal')?.remove();
                document.querySelector('.sc-cart-tax')?.remove();
                document.querySelector('.sc-cart-total')?.remove();
            }
        } catch (error) {
            console.error("Failed to update cart quantity:", error);
        }
    },

    _onRemoveLine(ev) {
        const lineId = ev.currentTarget.dataset.lineId;
        $(ev.currentTarget).closest('.input-group').find('.js_quantity').val(0).trigger("change");
        const lineEl = document.querySelector(`#scita_sidebar_line_${lineId}`);
        if (lineEl) {
            lineEl.remove();
        }
        this._reloadCartSidebar();
    },

    async _refreshCart(data) {
        data["cart_quantity"] = data.cart_quantity || 0;
        wSaleUtils.updateCartNavBar(data);
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