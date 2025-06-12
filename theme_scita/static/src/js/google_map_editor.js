/** @odoo-module **/

import options from "@web_editor/js/editor/snippets.options";
import { renderToElement } from "@web/core/utils/render";
import { _t } from "@web/core/l10n/translation";


options.registry.ImageHotspot = options.Class.extend({
    init: function () {
        this._super(...arguments);
        this.imageHotspot()
    },
    imageHotspot: function (previewMode, widgetValue) {
        if (widgetValue === 'on' && previewMode === false) {
            this.$target[0].parentElement.style.position = "relative";
            const target = this.$target[0].parentElement;
            const document = this.ownerDocument;
    
            const newA = document.createElement('a');
            newA.className = 'popup-product btn btn-sm btn-primary';
            newA.setAttribute('data-bs-toggle', 'popover');
            newA.setAttribute('data-bs-trigger', 'hover focus');
            newA.setAttribute('data-bs-placement', 'top');
            newA.setAttribute('title', 'Product Info');
            newA.setAttribute('data-bs-content', 'Select a product to show details');
            newA.href = '#';
    
            this.$target[0].after(newA);
    
            // Wait until DOM is ready, then initialize popover
            setTimeout(() => {
                new bootstrap.Popover(newA);
            }, 100); // delay helps avoid init issues
        }
    
        if (widgetValue === 'off' && previewMode === false) {
            const target = this.$target[0];
            if (target.nextElementSibling && target.nextElementSibling.classList.contains('popup-product')) {
                bootstrap.Popover.getInstance(target.nextElementSibling)?.dispose(); // clean up popover
                target.nextElementSibling.remove();
            }
        }
    },
    

    async setProductTemplate(previewMode, widgetValue) {
        let target = this.$target[0].nextElementSibling;
        let href = `/shop/${widgetValue}`;
        target.setAttribute("href", href);
    
        // Dummy product info for testing
        const dummyContent = `<b>Product ID:</b> ${widgetValue}<br><i>Static description preview...</i>`;
        target.setAttribute('data-bs-content', dummyContent);
    
        // Re-init popover to update content
        const existingPopover = bootstrap.Popover.getInstance(target);
        if (existingPopover) {
            existingPopover.setContent({ '.popover-body': dummyContent });
        } else {
            new bootstrap.Popover(target);
        }
    },    
    
    async setVertical(previewMode, widgetValue) {
        let target = this.$target[0].nextElementSibling;
        let value = parseFloat(widgetValue);
        target.style.top = `${value}%`;
    },
    async setHorizontal(previewMode, widgetValue) {
        let target = this.$target[0].nextElementSibling;
        let value = parseFloat(widgetValue);
        target.style.left = `${value}%`;
    },
    async setProductTemplate(previewMode, widgetValue) {
        let target = this.$target[0].nextElementSibling;
        let value = `/shop/${widgetValue}`
        target.setAttribute("href", value);
    }

});

    options.registry.s_google_map = options.Class.extend({
        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.find(".google_map_v1").empty();
            if (!editMode) {
                self.$el.find(".google_map_v1").on("click", $.bind(self.map, self));
            }
        },

        onBuilt: function() {
            var self = this;
            this._super();
            if (this.map()) {
                this.map().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },

        map: function(type, value) {
            var self = this;
            self.$modal = $(renderToElement("theme_scita.s_google_map_modal"));
            self.$modal.appendTo('body');
            self.$modal.modal('show');
            // address_html_code
            var $address_data = self.$modal.find("#set_map_data");
            $address_data.on('click', function() {
                var html_code = self.$modal.find("textarea#address_html_code").val();
                self.$target.empty().append(html_code);
            });
        }

    });
    options.registry.s_google_map_content = options.Class.extend({
        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.find(".google_map_v2").empty();
            if (!editMode) {
                self.$el.find(".google_map_v2").on("click", $.bind(self.map_section, self));
            }
        },

        onBuilt: function() {
            var self = this;
            this._super();
            if (this.map_section()) {
                this.map_section().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },

        map_section: function(type, value) {
            var self = this;
            self.$modal = $(renderToElement("theme_scita.s_google_map_content_modal"));
            self.$modal.appendTo('body');
            self.$modal.modal('show');
            var $address_set_btn = self.$modal.find("#set_map_data_content");
            $address_set_btn.on('click', function() {
                var html_ecode = self.$modal.find("textarea#address_content_html_code").val();
                self.$target.find(".map_data_container").empty().append(html_ecode)
            });
        }
    });