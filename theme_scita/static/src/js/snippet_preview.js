 /** @odoo-module **/

 import publicWidget from "@web/legacy/js/public/public_widget";

 publicWidget.registry.snippetPreviewSwitcher = publicWidget.Widget.extend({
     selector: '#wrapwrap',
     events: {
         'change #staticSnippets': '_onSnippetChange',
         'change #dynamicSnippets': '_onSnippetChange',
     },

     start: function () {
        this._super(...arguments);
    
        this._renderActiveTabSnippet();
        const tabs = document.querySelectorAll('a[data-bs-toggle="tab"]');
        tabs.forEach(tab => {
            tab.addEventListener('shown.bs.tab', (e) => {
                this._renderActiveTabSnippet();
            });
        });
    
        return Promise.resolve();
    },
    
    _renderActiveTabSnippet: function () {
        const activeTab = document.querySelector('.tab-pane.active');
        if (!activeTab) return;
    
        if (activeTab.id === 'static') {
            const staticSelect = document.querySelector('#staticSnippets');
            if (staticSelect) {
                this._onSnippetChange({ currentTarget: staticSelect });
            }
        } else if (activeTab.id === 'dynamic') {
            const dynamicSelect = document.querySelector('#dynamicSnippets');
            if (dynamicSelect) {
                this._onSnippetChange({ currentTarget: dynamicSelect });
            }
        }
    },    
    
    _onSnippetChange: function (ev) {
        if (!ev || !ev.currentTarget) return;
    
        const selectedValue = ev.currentTarget.value;
    
        const containers = document.querySelectorAll('.snippet-container');
        containers.forEach(container => {
            container.classList.add('d-none');
        });
    
        const selectedContainer = document.getElementById('preview-' + selectedValue);
        if (selectedContainer) {
            selectedContainer.classList.remove('d-none');
        } else {
            console.warn('No preview found for:', selectedValue);
        }
    }    
 });


