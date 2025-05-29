# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
from odoo.addons.website_sale.controllers.main import WebsiteSale


class WebsiteSaleExtended(WebsiteSale):

    @http.route(['/shop/<model("product.template"):product>'], type='http', auth="public", website=True,
                sitemap=WebsiteSale.sitemap_products, readonly=True)
    def product(self, product, category='', search='', **kwargs):
        # First check access as original method
        if not request.website.has_ecommerce_access():
            return request.redirect('/web/login')

        # Call the original method to get the default values
        values = self._prepare_product_values(product, category, search, **kwargs)

        # Fetch or create current sale order (cart)
        order_sudo = request.website.sale_get_order(force_create=True)
        if order_sudo.state != 'draft':
            request.website.sale_reset()
            order_sudo = request.website.sale_get_order(force_create=True)

        # Add the order to the template context
        values.update({
            'website_sale_order': order_sudo,
        })
        return request.render("website_sale.product", values)
