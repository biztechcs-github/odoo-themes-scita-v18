/** @odoo-module **/
import publicWidget from "@web/legacy/js/public/public_widget";

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