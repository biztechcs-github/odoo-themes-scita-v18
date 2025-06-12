/** @odoo-module **/


$(document).ready(function () {
    $('.ab-category').on("click",function(ev) {
        $('body').addClass("sct_shop_box_overlay");
    });
    $('.ab-category-close').on("click",function() {
        $('body').removeClass("sct_shop_box_overlay");
    });

    if ($('div').hasClass("ab-mob-view")){
        $('#wrapwrap').addClass("ab-btm-cat");
    }
});
