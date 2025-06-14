# -*- coding: utf-8 -*-
# Part of AppJetty. See LICENSE file for full copyright and licensing details.

import re
import math
import json
import os
from datetime import datetime
from functools import partial
from odoo.modules.module import get_resource_path
from werkzeug.exceptions import Forbidden, NotFound
from odoo import http, SUPERUSER_ID, fields, tools
from odoo.http import request
from odoo.osv import expression
from odoo.addons.website.controllers.main import QueryURL
from odoo.addons.website_sale.controllers import main
from odoo.addons.website_sale.controllers.main import WebsiteSale
from odoo.addons.website_sale.controllers.main import TableCompute
from odoo.addons.website.controllers.main import Website
from odoo.addons.base.models.assetsbundle import AssetsBundle
from odoo.tools import lazy, SQL
from odoo.tools import clean_context, float_round, groupby, lazy, single_email_re, str2bool, SQL
from collections import defaultdict
from itertools import product as cartesian_product


class WebsiteAutocomplate(Website):

    @http.route('/website/snippet/autocomplete', type='json', auth='public', website=True, readonly=True)
    def autocomplete(self, search_type=None, term=None, order=None, limit=5, max_nb_chars=999, options=None):
        res = super().autocomplete(search_type='products_only', term=term, order=order, limit=limit,
                                   max_nb_chars=max_nb_chars, options=options)
        for rslt in res.get('results'):
            rslt.update({'category': False})
        categories_result = super().autocomplete(search_type='product_categories_only', term=term, order=order,
                                                 limit=limit, max_nb_chars=max_nb_chars, options=options)
        for rslt in categories_result.get('results'):
            rslt.update({'category': True})
            if term in str(rslt.get('name')) or term.title() in str(rslt.get('name')) or term.upper() in str(
                    rslt.get('name')):
                res.get('results').append(rslt)
        return res


class ScitaSliderSettings(http.Controller):

    def get_blog_data(self, slider_type):
        slider_header = request.env['blog.slider.config'].sudo().search(
            [('id', '=', int(slider_type))])
        values = {
            'slider_header': slider_header,
            'blog_slider_details': slider_header.collections_blog_post,
        }
        return values

    def get_categories_data(self, slider_id):
        slider_header = request.env['category.slider.config'].sudo().search(
            [('id', '=', int(slider_id))])
        values = {
            'slider_header': slider_header
        }
        values.update({
            'slider_details': slider_header.collections_category,
        })
        return values

    #  Image hotspot
    def get_image_hotspot_data(self, slider_id):
        slider_header = request.env['image.hotspot'].sudo().search(
            [('id', '=', int(slider_id))])
        values = {
            'slider_header': slider_header,
        }
        values.update({
            'slider_details': slider_header.hotspot_ids,
        })
        return values
    
    @http.route('/get_product_info/<int:product_id>', type='json', auth="public", website=True)
    def get_product_info(self, product_id):
        product = request.env['product.template'].sudo().browse(product_id)
        if not product.exists():
            return {}

        return {
            'name': product.name,
            'price': f"{product.list_price} {request.website.currency_id.symbol}",
            'description': product.website_description or product.description_sale or '',
        }

    def get_clients_data(self):
        client_data = request.env['res.partner'].sudo().search(
            [('add_to_slider', '=', True), ('website_published', '=', True)])
        values = {
            'client_slider_details': client_data,
        }
        return values

    def get_teams_data(self):
        employee = request.env['hr.employee'].sudo().search(
            [('include_inourteam', '=', 'True')])
        values = {
            'employee': employee,
        }
        return values

    @http.route('/shop/cart/sidebar', type='json', auth='public', website=True)
    def custom_cart_sidebar(self):
        order = request.website.sale_get_order()
        values = {
            'website_sale_order': order,
            'res_company': request.env.company,
            'website': request.env['website'].get_current_website()
        }
        html = request.env['ir.ui.view']._render_template('theme_scita.cart_sidebar_template', values)
        return {'html': html}

    #  Top Dealers Snippet Controller Start
    @http.route(['/theme_scita/top_dealers'], type="http", auth="public", website=True)
    def scita_get_top_dealers(self, **post):
        top_dealers_data = request.env['top.dealers.configuration'].sudo().search([], limit=1)
        values = {
            'top_dealers_details': top_dealers_data.vendor_ids,
        }
        return request.render("theme_scita.theme_scita_top_dealers_snippet_data", values)

    #  Top Dealers Snippet Controller End

    @http.route(['/theme_scita/blog_get_options'], type='json', auth="public", website=True)
    def scita_get_slider_options(self):
        slider_options = []
        option = request.env['blog.slider.config'].search(
            [('active', '=', True)], order="name asc")
        for record in option:
            slider_options.append({'id': record.id,
                                   'name': record.name})
        return slider_options

    @http.route(['/theme_scita/blog_get_dynamic_slider'], type='json', auth='public', website=True)
    def scita_get_dynamic_slider(self, **post):
        if post.get('slider-type'):
            values = self.get_blog_data(post.get('slider-type'))
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.theme_scita_blog_slider_view", values)

    @http.route(['/theme_scita/health_blog_get_dynamic_slider'], type='json', auth='public', website=True)
    def health_get_dynamic_slider(self, **post):
        if post.get('slider-type'):
            values = self.get_blog_data(post.get('slider-type'))
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.health_blog_slider_view", values)

    @http.route(['/theme_scita/second_blog_get_dynamic_slider'], type='json', auth='public', website=True)
    def second_get_dynamic_slider(self, **post):
        if post.get('slider-type'):
            values = self.get_blog_data(post.get('slider-type'))
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.scita_blog_2_slider_view", values)

    @http.route(['/theme_scita/third_blog_get_dynamic_slider'], type='json', auth='public', website=True)
    def third_get_dynamic_slider(self, **post):
        if post.get('slider-type'):
            values = self.get_blog_data(post.get('slider-type'))
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.scita_blog_3_slider_view", values)

    @http.route(['/theme_scita/six_blog_get_dynamic_slider'], type='json', auth='public', website=True)
    def six_get_dynamic_slider(self, **post):
        if post.get('slider-type'):
            values = self.get_blog_data(post.get('slider-type'))
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.scita_blog_6_slider_view", values)

    @http.route(['/theme_scita/forth_blog_get_dynamic_slider'], type='json', auth='public', website=True)
    def forth_get_dynamic_slider(self, **post):
        if post.get('slider-type'):
            values = self.get_blog_data(post.get('slider-type'))
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.scita_blog_4_slider_view", values)

    @http.route(['/theme_scita/fifth_blog_get_dynamic_slider'], type='json', auth='public', website=True)
    def fifth_get_dynamic_slider(self, **post):
        if post.get('slider-type'):
            values = self.get_blog_data(post.get('slider-type'))
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.scita_blog_5_slider_view", values)

    @http.route(['/theme_scita/seven_blog_get_dynamic_slider'], type='http', auth='public', website=True)
    def seven_get_dynamic_slider(self, **post):
        if post.get('slider-type'):
            values = self.get_blog_data(post.get('slider-type'))
            return request.render("theme_scita.scita_blog_7_slider_view", values)

    @http.route(['/theme_scita/eight_blog_get_dynamic_slider'], type='json', auth='public', website=True)
    def eight_get_dynamic_slider(self, **post):
        if post.get('slider-type'):
            values = self.get_blog_data(post.get('slider-type'))
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.scita_blog_8_slider_view", values)

    @http.route(['/theme_scita/blog_image_effect_config'], type='json', auth='public', website=True)
    def scita_product_image_dynamic_slider(self, **post):
        slider_data = request.env['blog.slider.config'].search(
            [('id', '=', int(post.get('slider_type')))])
        values = {
            's_id': str(slider_data.no_of_counts) + '-' + str(slider_data.id),
            'counts': slider_data.no_of_counts,
            'auto_rotate': slider_data.auto_rotate,
            'auto_play_time': slider_data.sliding_speed,
        }
        return values

    # for Client slider
    @http.route(['/theme_scita/get_clients_dynamically_slider'], type='json', auth='public', website=True)
    def get_clients_dynamically_slider(self, **post):
        values = self.get_clients_data()
        website = request.env['website'].get_current_website()
        IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
        return IrQweb._render("theme_scita.theme_scita_client_slider_view", values)

    @http.route(['/theme_scita/second_get_clients_dynamically_slider'], type='json', auth='public', website=True)
    def second_get_clients_dynamically_slider(self, **post):
        values = self.get_clients_data()
        website = request.env['website'].get_current_website()
        IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
        return IrQweb._render("theme_scita.second_client_slider_view", values)

    @http.route(['/theme_scita/third_get_clients_dynamically_slider'], type='json', auth='public', website=True)
    def third_get_clients_dynamically_slider(self, **post):
        values = self.get_clients_data()
        website = request.env['website'].get_current_website()
        IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
        return IrQweb._render("theme_scita.third_client_slider_view", values)

    # our team

    @http.route(['/biztech_emp_data_one/employee_data'], type='json', auth='public', website=True)
    def get_team_one_dynamically_slider(self, **post):
        values = self.get_teams_data()
        website = request.env['website'].get_current_website()
        IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
        return IrQweb._render("theme_scita.it_our_team_view", values)

    @http.route(['/biztech_emp_data_two/employee_data'], type='json', auth='public', website=True)
    def get_team_two_dynamically_slider(self, **post):
        values = self.get_teams_data()
        website = request.env['website'].get_current_website()
        IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
        return IrQweb._render("theme_scita.our_team_varient_2_view", values)

    @http.route(['/biztech_emp_data_three/employee_data'], type='json', auth='public', website=True)
    def get_team_three_dynamically_slider(self, **post):
        values = self.get_teams_data()
        website = request.env['website'].get_current_website()
        IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
        return IrQweb._render("theme_scita.our_team_varient_3_view", values)

    @http.route(['/biztech_emp_data_four/employee_data'], type='json', auth='public', website=True)
    def get_team_four_dynamically_slider(self, **post):
        values = self.get_teams_data()
        website = request.env['website'].get_current_website()
        IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
        return IrQweb._render("theme_scita.our_team_varient_4_view", values)

    @http.route(['/biztech_emp_data_five/employee_data'], type='json', auth='public', website=True)
    def get_team_five_dynamically_slider(self, **post):
        values = self.get_teams_data()
        website = request.env['website'].get_current_website()
        IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
        return IrQweb._render("theme_scita.our_team_varient_5_view", values)

    @http.route(['/biztech_emp_data_six/employee_data'], type='json', auth='public', website=True)
    def get_team_six_dynamically_slider(self, **post):
        values = self.get_teams_data()
        website = request.env['website'].get_current_website()
        IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
        return IrQweb._render("theme_scita.our_team_varient_6_view", values)

    @http.route(['/biztech_emp_data_seven/employee_data'], type='json', auth='public', website=True)
    def get_team_seven_dynamically_slider(self, **post):
        values = self.get_teams_data()
        website = request.env['website'].get_current_website()
        IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
        return IrQweb._render("theme_scita.our_team_varient_7_view", values)

    # For Category slider

    @http.route(['/theme_scita/category_get_options'], type='json', auth="public", website=True)
    def category_get_slider_options(self):
        slider_options = []
        option = request.env['category.slider.config'].search(
            [('active', '=', True)], order="name asc")
        for record in option:
            slider_options.append({'id': record.id,
                                   'name': record.name})
        return slider_options

    @http.route(['/theme_scita/category_get_dynamic_slider'], type='json', auth='public', website=True)
    def category_get_dynamic_slider(self, **post):
        if post.get('slider-id'):
            values = self.get_categories_data(post.get('slider-id'))
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.theme_scita_cat_slider_view", values)

    # Image Hotspot
    @http.route(['/theme_scita/get_image_hotspot'], type='json', auth='public', website=True)
    def get_image_hotspot(self, **post):
        if post.get('slider-id'):
            values = self.get_image_hotspot_data(post.get('slider-id'))
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.theme_scita_image_hotspot_view", values)

    @http.route(['/theme_scita/second_get_dynamic_cat_slider'], type='json', auth='public', website=True)
    def second_get_dynamic_cat_slider(self, **post):
        if post.get('slider-id'):
            values = self.get_categories_data(post.get('slider-id'))
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.second_cat_slider_view", values)

    @http.route(['/theme_scita/dynamic_color_category_slider'], type='json', auth='public', website=True)
    def third_get_dynamic_cat_slider(self, **post):
        if post.get('slider-id'):
            values = self.get_categories_data(post.get('slider-id'))
            values['color'] = post.get('color')
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.theme_scita_category_slider_gray_view", values)

    @http.route(['/theme_scita/category_slider_3'], type='json', auth='public', website=True)
    def category_slider_value(self, **post):
        if post.get('slider-id'):
            values = self.get_categories_data(post.get('slider-id'))
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            count_dict = {}
            for cat in values['slider_details']:
                count_dict[cat.id] = len(request.env['product.template'].search([('public_categ_ids', 'in', cat.id)]))
            values['count_dict'] = count_dict

            return IrQweb._render("theme_scita.theme_scita_category_slider_3_view", values)

    @http.route(['/theme_scita/category_slider_4'], type='json', auth='public', website=True)
    def category_slider_four(self, **post):
        if post.get('slider-id'):
            values = self.get_categories_data(post.get('slider-id'))
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.theme_scita_category_slider_4_view", values)

    @http.route(['/theme_scita/scita_image_effect_config'], type='json', auth='public', website=True)
    def category_image_dynamic_slider(self, **post):
        slider_data = request.env['category.slider.config'].search(
            [('id', '=', int(post.get('slider_id')))])
        values = {
            's_id': slider_data.name.lower().replace(' ', '-') + '-' + str(slider_data.id),
            'counts': slider_data.no_of_counts,
            'auto_rotate': slider_data.auto_rotate,
            'auto_play_time': slider_data.sliding_speed,
        }
        return values

    # For Product slider
    @http.route(['/theme_scita/product_get_options'], type='json', auth="public", website=True)
    def product_get_slider_options(self):
        slider_options = []
        option = request.env['product.slider.config'].search(
            [('active', '=', True)], order="name asc")
        for record in option:
            slider_options.append({'id': record.id,
                                   'name': record.name})
        return slider_options

    @http.route(['/theme_scita/product_get_dynamic_slider'], type='json', auth='public', website=True)
    def product_get_dynamic_slider(self, **post):
        if post.get('slider-id'):
            slider_header = request.env['product.slider.config'].sudo().search(
                [('id', '=', int(post.get('slider-id')))])
            values = {
                'slider_header': slider_header
            }
            values.update({
                'slider_details': slider_header.collections_products,
            })
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.theme_scita_product_slider_view", values)

    @http.route(['/theme_scita/product_image_effect_config'], type='json', auth='public', website=True)
    def product_image_dynamic_slider(self, **post):
        slider_data = request.env['product.slider.config'].search(
            [('id', '=', int(post.get('slider_id')))])
        values = {
            's_id': slider_data.name.lower().replace(' ', '-') + '-' + str(slider_data.id),
            'counts': slider_data.no_of_counts,
            'auto_rotate': slider_data.auto_rotate,
            'auto_play_time': slider_data.sliding_speed,
        }
        return values

    # For multi product slider
    @http.route(['/theme_scita/product_multi_get_options'], type='json', auth="public", website=True)
    def product_multi_get_slider_options(self):
        slider_options = []
        option = request.env['multi.slider.config'].sudo().search(
            [('active', '=', True)], order="name asc")
        for record in option:
            slider_options.append({'id': record.id,
                                   'name': record.name})
        return slider_options

    @http.route(['/theme_scita/deal_get_options'], type='json', auth="public", website=True)
    def product_x_deal_get_options(self):
        slider_options = []
        deals = request.env['biztech.deal.of.the.day.configuration'].sudo().search(
            [('active', '=', True)], order="name asc")
        for record in deals:
            slider_options.append({'id': record.id,
                                   'name': record.name})
        return slider_options

    @http.route(['/deal/product_multi_get_dynamic_seller'], type='json', auth='public', website=True)
    def product_multi_get_dynamic_seller(self, **post):
        if post.get('slider-deal'):
            slider_header = request.env['biztech.deal.of.the.day.configuration'].sudo().search(
                [('id', '=', int(post.get('slider-deal')))])
            rel_lst = []
            inner_lst = []
            if slider_header:
                for rel in slider_header.product_ids:
                    inner_lst.append(rel)
                    if len(inner_lst) == 4:
                        rel_lst.append(inner_lst)
                        inner_lst = []
                else:
                    if inner_lst:
                        rel_lst.append(inner_lst)
            values = {
                'slider_details': rel_lst,
                'slider_header': slider_header,
                "deals_banners": slider_header.deal_of_day_banner_ids,
            }
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.multi_deal_seller_slider_view", values)

    @http.route(['/theme_scita/product_multi_deal_seller_config'], type='json', auth='public', website=True)
    def product_multi_deal_seller_image_slider(self, **post):
        deal_data = request.env['biztech.deal.of.the.day.configuration'].sudo().search(
            [('id', '=', int(post.get('slider_deals')))])
        values = {
            'deal_id': str(deal_data.id),
        }
        return values

    # **********************   snippets new added end  ***************
    @http.route(['/retial/product_multi_get_dynamic_slider'], type='json', auth='public', website=True)
    def retail_multi_get_dynamic_slider(self, **post):
        context, pool = dict(request.context), request.env
        if post.get('slider-type'):
            slider_header = request.env['multi.slider.config'].sudo().search(
                [('id', '=', int(post.get('slider-type')))])

            if not context.get('pricelist'):
                current_website = request.website.get_current_website()
                pricelist = current_website._get_current_pricelist()
                context = dict(request.context, pricelist=int(pricelist))
            else:
                pricelist = pool.get('product.pricelist').browse(
                    context['pricelist'])

            context.update({'pricelist': pricelist.id})
            from_currency = pool['res.users'].sudo().browse(
                SUPERUSER_ID).company_id.currency_id
            to_currency = pricelist.currency_id

            def compute_currency(price):
                return pool['res.currency']._convert(
                    price, from_currency, to_currency, fields.Date.today())

            values = {
                'slider_details': slider_header,
                'slider_header': slider_header,
                'compute_currency': compute_currency,
            }
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.scita_multi_cat_slider_view", values)

    @http.route(['/fashion/fashion_product_multi_get_dynamic_slider'], type='json', auth='public', website=True)
    def fashion_multi_get_dynamic_slider(self, **post):
        context, pool = dict(request.context), request.env
        if post.get('slider-type'):
            slider_header = request.env['multi.slider.config'].sudo().search(
                [('id', '=', int(post.get('slider-type')))])

            if not context.get('pricelist'):
                current_website = request.website.get_current_website()
                pricelist = current_website._get_current_pricelist()
                context = dict(request.context, pricelist=int(pricelist))
            else:
                pricelist = pool.get('product.pricelist').browse(
                    context['pricelist'])

            context.update({'pricelist': pricelist.id})
            from_currency = pool['res.users'].sudo().browse(
                SUPERUSER_ID).company_id.currency_id
            to_currency = pricelist.currency_id

            def compute_currency(price):
                return pool['res.currency']._convert(
                    price, from_currency, to_currency, fields.Date.today())

            values = {
                'slider_details': slider_header,
                'slider_header': slider_header,
                'compute_currency': compute_currency,
            }
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.fashion_multi_cat_slider_view", values)

    @http.route(['/theme_scita/product_multi_image_effect_config'], type='json', auth='public', website=True)
    def product_multi_product_image_dynamic_slider(self, **post):
        slider_data = request.env['multi.slider.config'].sudo().search(
            [('id', '=', int(post.get('slider_type')))])
        values = {
            's_id': slider_data.no_of_collection + '-' + str(slider_data.id),
            'counts': slider_data.no_of_collection,
            'auto_rotate': slider_data.auto_rotate,
            'auto_play_time': slider_data.sliding_speed,
            'rating_enable': slider_data.is_rating_enable
        }
        return values

    # Multi image gallery
    @http.route(['/theme_scita/scita_multi_image_thumbnail_config'], type='json', auth="public", website=True)
    def get_multi_image_effect_config(self):

        cur_website = request.website
        values = {
            'no_extra_options': cur_website.no_extra_options,
            'interval_play': cur_website.interval_play,
            'enable_disable_text': cur_website.enable_disable_text,
            'color_opt_thumbnail': cur_website.color_opt_thumbnail,
            'theme_panel_position': cur_website.thumbnail_panel_position,
            'change_thumbnail_size': cur_website.change_thumbnail_size,
            'thumb_height': cur_website.thumb_height,
            'thumb_width': cur_website.thumb_width,
        }
        return values

    # For new brand snippet and product and category snippet

    @http.route(['/theme_scita/brand_get_options'], type='json', auth="public", website=True)
    def custom_brand_get_options(self):
        slider_options = []
        option = request.env['brand.snippet.config'].sudo().search(
            [('active', '=', True)], order="name asc")
        for record in option:
            slider_options.append({'id': record.id,
                                   'name': record.name})
        return slider_options

    @http.route(['/theme_scita/custom_pro_get_dynamic_slider'], type='json', auth='public', website=True)
    def custom_pro_get_dynamic_slider(self, **post):
        if post.get('slider-type'):
            slider_header = request.env['product.category.img.slider.config'].sudo().search(
                [('id', '=', int(post.get('slider-type')))])
            values = {
                'slider_header': slider_header
            }
            if slider_header.prod_cat_type == 'product':
                values.update(
                    {'slider_details': slider_header.collections_product})
            if slider_header.prod_cat_type == 'category':
                values.update(
                    {'slider_details': slider_header.collections_category})
            values.update({'slider_type': slider_header.prod_cat_type})
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.custom_scita_cat_slider_view", values)

    @http.route(['/theme_scita/custom_get_brand_slider'], type='json', auth='public', website=True)
    def custom_get_brand_slider(self, **post):
        keep = QueryURL('/theme_scita/custom_get_brand_slider', brand_id=[])
        if post.get('slider-type'):
            slider_header = request.env['brand.snippet.config'].sudo().search(
                [('id', '=', int(post.get('slider-type')))])
            values = {
                'slider_header': slider_header,
                'website_brands': slider_header.collections_brands
            }
        website = request.env['website'].get_current_website()
        IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
        return IrQweb._render("theme_scita.custom_scita_brand_slider_view", values)

    @http.route(['/theme_scita/pro_get_options'], type='json', auth="public", website=True)
    def get_slider_options(self):
        slider_options = []
        option = request.env['product.category.img.slider.config'].sudo().search(
            [('active', '=', True)], order="name asc")
        for record in option:
            slider_options.append({'id': record.id,
                                   'name': record.name})
        return slider_options

    # Zipcode delivery status
    @http.route(['/shop/zipcode'], type='json', auth="public", website=True)
    def scita_get_delivery_zipcode(self, zip_code, **post):
        if zip_code:
            zip_obj = request.env['delivery.zipcode'].search(
                [('name', '=', zip_code)])
            if zip_obj.id:
                return {'status': True}
            else:
                return {'status': False}
        else:
            return {'zip': 'notavailable'}

    @http.route(['/product_column_five'], type='json', auth='public', website=True)
    def get_product_column_five(self, **post):
        context, pool = dict(request.context), request.env
        if post.get('slider-type'):
            slider_header = request.env['product.snippet.configuration'].sudo().search(
                [('id', '=', int(post.get('slider-type')))])
            if not context.get('pricelist'):
                # pricelist = request.website.get_current_pricelist()
                current_website = request.website.get_current_website()
                pricelist = current_website._get_current_pricelist()
                context = dict(request.context, pricelist=int(pricelist))
            else:
                pricelist = pool.get('product.pricelist').browse(
                    context['pricelist'])

            context.update({'pricelist': pricelist.id})
            from_currency = pool['res.users'].sudo().browse(
                SUPERUSER_ID).company_id.currency_id
            to_currency = pricelist.currency_id

            def compute_currency(price):
                return pool['res.currency']._convert(
                    price, from_currency, to_currency, fields.Date.today())

            values = {
                'slider_details': slider_header,
                'slider_header': slider_header,
                'compute_currency': compute_currency,
                'products': slider_header.collection_of_products
            }
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.sct_product_snippet_1_view", values)

    @http.route(['/product/product_snippet_data_two'], type='json', auth='public', website=True)
    def product_snippet_data_two(self, **post):
        context, pool = dict(request.context), request.env
        if post.get('slider-type'):
            slider_header = request.env['product.snippet.configuration'].sudo().search(
                [('id', '=', int(post.get('slider-type')))])
            if not context.get('pricelist'):
                # pricelist = request.website.get_current_pricelist()
                current_website = request.website.get_current_website()
                pricelist = current_website._get_current_pricelist()
                context = dict(request.context, pricelist=int(pricelist))
            else:
                pricelist = pool.get('product.pricelist').browse(
                    context['pricelist'])

            context.update({'pricelist': pricelist.id})
            from_currency = pool['res.users'].sudo().browse(
                SUPERUSER_ID).company_id.currency_id
            to_currency = pricelist.currency_id

            def compute_currency(price):
                return pool['res.currency']._convert(
                    price, from_currency, to_currency, fields.Date.today())

            values = {
                'slider_details': slider_header,
                'slider_header': slider_header,
                'compute_currency': compute_currency,
                'products': slider_header.collection_of_products
            }
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.sct_product_snippet_2_view", values)

    @http.route(['/theme_scita/product_configuration'], type='json', auth="public", website=True)
    def snippet_get_product_configuration(self):
        slider_options = []
        option = request.env['product.snippet.configuration'].sudo().search(
            [('active', '=', True)], order="name asc")
        for record in option:
            slider_options.append({'id': record.id,
                                   'name': record.name})
        return slider_options

    @http.route(['/deals-of-the-day'], type="http", auth="public", website=True)
    def products(self, **post):
        product = request.env['product.template'].search(
            [('deal_product', '=', True), ("website_id", "in", (False, request.website.id))])
        values = {'deal_products': product}
        return request.render("theme_scita.biz_deal_page", values)


class ScitaShop(WebsiteSale):

    def _prepare_product_values(self, product, category, search, **kwargs):
        res = super(ScitaShop, self)._prepare_product_values(product, category, search, **kwargs)
        request_args = request.httprequest.args
        attrib_list = request_args.getlist('attribute_value')
        attrib_values = [[int(x) for x in v.split("-")] for v in attrib_list if v]
        domain = self._get_shop_domain(search, category, attrib_values)
        products = request.env['product.template'].search(domain, order=self._get_search_order(kwargs)).ids
        prod_index = products.index(product.id)
        if prod_index != len(products) - 1:
            res['next_product'] = products[prod_index + 1]
        if prod_index != 0:
            res['prev_product'] = products[prod_index - 1]
        return res

    # @http.route(['/shop/pager_selection/<model("product.per.page.no"):pl_id>'], type='http', auth="public", website=True)
    # def product_page_change(self, pl_id, **post):
    #     request.session['default_paging_no'] = pl_id.name
    #     main.PPG = pl_id.name
    #     return request.redirect(request.httprequest.referrer or '/shop')

    @http.route('/shop/products/recently_viewed', type='json', auth='public', website=True)
    def products_recently_viewed(self, **kwargs):
        if request.env['website'].sudo().get_current_website().theme_id.name == 'theme_scita':
            return self._get_scita_products_recently_viewed()
        else:
            return self._get_products_recently_viewed()

    def _get_scita_products_recently_viewed(self):
        max_number_of_product_for_carousel = 12
        visitor = request.env['website.visitor']._get_visitor_from_request()
        if visitor:
            excluded_products = request.website.sale_get_order().mapped(
                'order_line.product_id.id')
            products = request.env['website.track'].sudo().read_group(
                [('visitor_id', '=', visitor.id), ('product_id', '!=', False),
                 ('product_id', 'not in', excluded_products)],
                ['product_id', 'visit_datetime:max'], ['product_id'], limit=max_number_of_product_for_carousel,
                orderby='visit_datetime DESC')
            products_ids = [product['product_id'][0] for product in products]
            if products_ids:
                viewed_products = request.env['product.product'].browse(
                    products_ids)

                FieldMonetary = request.env['ir.qweb.field.monetary']
                monetary_options = {
                    'display_currency': request.website.get_current_pricelist().currency_id,
                }
                rating = request.website.viewref(
                    'theme_scita.theme_scita_rating').active
                res = {'products': []}
                for product in viewed_products:
                    combination_info = product._get_combination_info_variant()
                    res_product = product.read(
                        ['id', 'name', 'website_url'])[0]
                    res_product.update(combination_info)
                    res_product['price'] = FieldMonetary.value_to_html(
                        res_product['price'], monetary_options)
                    if rating:
                        res_product['rating'] = request.env["ir.ui.view"]._render_template(
                            'portal_rating.rating_widget_stars_static', values={
                                'rating_avg': product.rating_avg,
                                'rating_count': product.rating_count,
                            })
                    res['products'].append(res_product)

                return res
        return {}

    @http.route([
        '''/shop''',
        '''/shop/page/<int:page>''',
        '''/shop/category/<model("product.public.category"):category>''',
        '''/shop/category/<model("product.public.category"):category>/page/<int:page>''',
        '''/shop/brands'''
    ], type='http', auth="public", website=True, sitemap=WebsiteSale.sitemap_shop, csrf=False, save_session=False)
    def shop(self, page=0, category=None, search='', min_price=0.0, max_price=0.0, ppg=False, brands=None, **post):
        if request.env['website'].sudo().get_current_website().theme_id.name == 'theme_scita':
            add_qty = int(post.get('add_qty', 1))
            try:
                min_price = float(min_price)
            except ValueError:
                min_price = 0
            try:
                max_price = float(max_price)
            except ValueError:
                max_price = 0

            Category = request.env['product.public.category']
            if category:
                category = Category.search([('id', '=', int(category))], limit=1)
                if not category or not category.can_access_from_current_website():
                    raise NotFound()
            else:
                category = Category

            website = request.env['website'].get_current_website()
            website_domain = website.website_domain()
            if brands:
                req_ctx = request.context.copy()
                req_ctx.setdefault('brand_id', int(brands))
                request.context = req_ctx
            if ppg:
                try:
                    ppg = int(ppg)
                    post['ppg'] = ppg
                except ValueError:
                    ppg = False
            if not ppg:
                ppg = website.shop_ppg or 20

            ppr = website.shop_ppr or 4

            gap = website.shop_gap or "16px"

            request_args = request.httprequest.args
            tags = {}
            attrib_list = request_args.getlist('attribute_value')
            attrib_values = [[int(x) for x in v.split("-")] for v in attrib_list if v]
            attributes_ids = {v[0] for v in attrib_values}
            attrib_set = {v[1] for v in attrib_values}
            filter_by_tags_enabled = website.is_view_active('website_sale.filter_products_tags')
            if filter_by_tags_enabled:
                tags = request_args.getlist('tags')
                # Allow only numeric tag values to avoid internal error.
                if tags and all(tag.isnumeric() for tag in tags):
                    post['tags'] = tags
                    tags = {int(tag) for tag in tags}
                else:
                    post['tags'] = None
                    tags = {}
            keep = QueryURL('/shop',
                            **self._shop_get_query_url_kwargs(category=category and int(category), search=search,
                                                              attrib=attrib_list, min_price=min_price,
                                                              max_price=max_price, order=post.get('order')))

            # pricelist_context, pricelist = self._get_pricelist_context()
            now = datetime.timestamp(datetime.now())
            pricelist = website.pricelist_id
            if 'website_sale_pricelist_time' in request.session:
                # Check if we need to refresh the cached pricelist
                pricelist_save_time = request.session['website_sale_pricelist_time']
                if pricelist_save_time < now - 60 * 60:
                    request.session.pop('website_sale_current_pl', None)
                    website.invalidate_recordset(['pricelist_id'])
                    pricelist = website.pricelist_id
                    request.session['website_sale_pricelist_time'] = now
                    request.session['website_sale_current_pl'] = pricelist.id
            else:
                request.session['website_sale_pricelist_time'] = now
                request.session['website_sale_current_pl'] = pricelist.id

            brand_list = request.httprequest.args.getlist('brand')
            brand_set = set([int(v) for v in brand_list])
            request.update_context(pricelist=pricelist.id, partner=request.env.user.partner_id)

            filter_by_price_enabled = website.is_view_active('website_sale.filter_products_price')
            if filter_by_price_enabled:
                company_currency = website.company_id.currency_id
                conversion_rate = request.env['res.currency']._get_conversion_rate(
                    company_currency, pricelist.currency_id, request.website.company_id, fields.Date.today())
            else:
                conversion_rate = 1

            url = "/shop"
            if search:
                post["search"] = search
            if attrib_list:
                post['attrib'] = attrib_list

            brandlistdomain = list(map(int, brand_list))
            options = {
                'displayDescription': True,
                'displayDetail': True,
                'displayExtraDetail': True,
                'displayExtraLink': True,
                'displayImage': True,
                'tags': tags,
                'allowFuzzy': not post.get('noFuzzy'),
                'category': str(category.id) if category else None,
                'min_price': min_price / conversion_rate,
                'max_price': max_price / conversion_rate,
                'attrib_values': attrib_values,
                'display_currency': pricelist.currency_id,
                'brandlistdomain': brandlistdomain,
            }
            # No limit because attributes are obtained from complete product list
            fuzzy_search_term, product_count, search_product = self._shop_lookup_products(attrib_set, options, post,
                                                                                          search, website)
            # search_product = details[0].get('results', request.env['product.template']).with_context(bin_size=True)

            filter_by_price_enabled = website.is_view_active('website_sale.filter_products_price')
            if filter_by_price_enabled:
                # TODO Find an alternative way to obtain the domain through the search metadata.
                Product = request.env['product.template'].with_context(bin_size=True)
                domain = self._get_shop_domain(search, category, attrib_values)
                # domain = self._get_search_domain(search, category, attrib_values)

                # This is ~4 times more efficient than a search for the cheapest and most expensive products

                query = Product._where_calc(domain)
                Product._apply_ir_rules(query, 'read')
                sql = query.select(
                    SQL(
                        "COALESCE(MIN(list_price), 0) * %(conversion_rate)s, COALESCE(MAX(list_price), 0) * %(conversion_rate)s",
                        conversion_rate=conversion_rate,
                    )
                )
                available_min_price, available_max_price = request.env.execute_query(sql)[0]

                if min_price or max_price:
                    # The if/else condition in the min_price / max_price value assignment
                    # tackles the case where we switch to a list of products with different
                    # available min / max prices than the ones set in the previous page.
                    # In order to have logical results and not yield empty product lists, the
                    # price filter is set to their respective available prices when the specified
                    # min exceeds the max, and / or the specified max is lower than the available min.
                    if min_price:
                        min_price = min_price if min_price <= available_max_price else available_min_price
                        post['min_price'] = min_price
                    if max_price:
                        max_price = max_price if max_price >= available_min_price else available_max_price
                        post['max_price'] = max_price
            ProductTag = request.env['product.tag']
            if filter_by_tags_enabled and search_product:
                all_tags = ProductTag.search(
                    expression.AND([
                        [('product_ids.is_published', '=', True), ('visible_on_ecommerce', '=', True)],
                        website_domain
                    ])
                )
            else:
                all_tags = ProductTag
            categs_domain = [('parent_id', '=', False)] + website_domain
            if search:
                search_categories = Category.search(
                    [('product_tmpl_ids', 'in', search_product.ids)] + website_domain
                ).parents_and_self
                categs_domain.append(('id', 'in', search_categories.ids))
            else:
                search_categories = Category
            categs = lazy(lambda: Category.search(categs_domain))

            slug = request.env['ir.http']._slug
            if category:
                url = "/shop/category/%s" % slug(category)

            pager = website.pager(url=url, total=product_count, page=page, step=ppg, scope=7, url_args=post)
            offset = pager['offset']
            products = search_product[offset:offset + ppg]

            ProductAttribute = request.env['product.attribute']
            if products:
                # get all products without limit
                attributes = lazy(lambda: ProductAttribute.search([
                    ('product_tmpl_ids', 'in', search_product.ids),
                    ('visibility', '=', 'visible'),
                ]))
            else:
                attributes = lazy(lambda: ProductAttribute.browse(attributes_ids))

            layout_mode = request.session.get('website_sale_shop_layout_mode')
            if not layout_mode:
                if website.viewref('website_sale.products_list_view').active:
                    layout_mode = 'list'
                else:
                    layout_mode = 'grid'
                request.session['website_sale_shop_layout_mode'] = layout_mode

            fiscal_position_sudo = website.fiscal_position_id.sudo()
            products_prices = lazy(lambda: products._get_sales_prices(website))

            prod_available = {}
            for prod in products:
                variants_available = {
                    p['id']: p for p in prod.product_variant_ids.sudo().read(['free_qty'])
                }
                free_qty = 0
                for p in prod.product_variant_ids:
                    free_qty += variants_available[p.id]['free_qty']
                prod_available[prod.id] = {
                    'free_qty': int(free_qty),
                }
            result = {}
            for cat in Category.search(website_domain):
                result[cat.id] = request.env['product.template'].search_count(
                    [('public_categ_ids', 'child_of', cat.id)])
            values = {
                'search': fuzzy_search_term or search,
                'original_search': fuzzy_search_term and search,
                'order': post.get('order', ''),
                'category': category,
                'attrib_values': attrib_values,
                'attrib_set': attrib_set,
                'pager': pager,
                'products': products,
                'pricelist': pricelist,
                'fiscal_position': fiscal_position_sudo,
                'add_qty': add_qty,
                # 'search_product': search_product, ??
                'search_count': product_count,  # common for all searchbox
                'bins': lazy(lambda: TableCompute().process(products, ppg, ppr)),
                'ppg': ppg,
                'ppr': ppr,
                # 'gap': gap, # new
                'categories': categs,
                'attributes': attributes,
                'keep': keep,
                'selected_attributes_hash': '',  # new
                'search_categories_ids': search_categories.ids,
                'layout_mode': layout_mode,
                'products_prices': products_prices,
                'get_product_prices': lambda product: lazy(lambda: products_prices[product.id]),
                'float_round': tools.float_round,
                'brand_set': brand_set,
                'prod_available': prod_available,
                'result': result
            }
            if filter_by_price_enabled:
                values['min_price'] = min_price or available_min_price
                values['max_price'] = max_price or available_max_price
                values['available_min_price'] = tools.float_round(available_min_price, 2)
                values['available_max_price'] = tools.float_round(available_max_price, 2)
            if filter_by_tags_enabled:
                values.update({'all_tags': all_tags, 'tags': tags})
            if category:
                values['main_object'] = category
            values.update(self._get_additional_shop_values(values))
            return request.render("website_sale.products", values)
        else:
            return super(ScitaShop, self).shop(page=page, category=category, search=search, min_price=min_price,
                                               max_price=max_price, ppg=ppg, **post)

    @http.route(['''/allcategories''',
                 '''/allcategories/category/<model("product.public.category"):category>'''
                 ], type='http', auth="public", website=True)
    def shop_by_get_category(self, category=None, **post):
        cat = {}
        shop_category = None
        if category:
            if category.child_id:
                child = category.child_id
                cat.update({'pro': child})
        else:
            shop_category = child_cat_ids = request.env['product.public.category'].sudo().search(
                [('parent_id', '=', None), ("website_id", "in", (False, request.website.id))], order='name asc')
            cat.update({'pro': shop_category})
        return request.render("theme_scita.shop_by_category", cat)

    def get_brands_data(self, product_count, product_label):
        keep = QueryURL('/shop/get_it_brand', brand_id=[])
        value = {
            'website_brands': False,
            'brand_header': False,
            'keep': keep
        }
        if product_count:

            brand_data = request.env['product.brands'].sudo().search(
                [('active', '=', True)], limit=int(product_count))
            if brand_data:
                value['website_brands'] = brand_data
        if product_label:
            value['brand_header'] = product_label
        return value

    @http.route(['/shop/get_brand_slider'],
                type='json', auth='public', website=True)
    def get_brand_slider(self, **post):
        if post.get('slider-type'):
            slider_header = request.env['brand.snippet.config'].sudo().search(
                [('id', '=', int(post.get('slider-type')))])
            values = {
                'slider_header': slider_header,
                'website_brands': slider_header.collections_brands
            }
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.retial_brand_snippet_1", values)
        return False

    @http.route(['/shop/get_box_brand_slider'],
                type='json', auth='public', website=True)
    def get_box_brand_slider(self, **post):
        if post.get('slider-type'):
            slider_header = request.env['brand.snippet.config'].sudo().search(
                [('id', '=', int(post.get('slider-type')))])
            values = {
                'slider_header': slider_header,
                'website_brands': slider_header.collections_brands
            }
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.box_brand_snippet_4", values)
        return False

    @http.route(['/shop/get_it_brand'],
                type='json', auth='public', website=True)
    def get_it_brand(self, **post):
        if post.get('slider-type'):
            slider_header = request.env['brand.snippet.config'].sudo().search(
                [('id', '=', int(post.get('slider-type')))])
            values = {
                'slider_header': slider_header,
                'website_brands': slider_header.collections_brands
            }
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.it_brand_snippet_1", values)
        return False

    @http.route('/update_my_wishlist', type="http", auth="public", website=True)
    def qv_update_my_wishlist(self, **kw):
        if kw['prod_id']:
            self.add_to_wishlist(product_id=int(kw['prod_id']))
        return

    @http.route(['/product_category_img_slider'], type='json', auth='public', website=True)
    def config_cat_product(self, **post):
        context, pool = dict(request.context), request.env
        print("====================post", post)
        if post.get('slider-type'):
            slider_header = request.env['product.category.img.slider.config'].sudo().search(
                [('id', '=', int(post.get('slider-type')))])
            if not context.get('pricelist'):
                # pricelist = request.website.get_current_pricelist()
                current_website = request.website.get_current_website()
                pricelist = current_website._get_current_pricelist()
                context = dict(request.context, pricelist=int(pricelist))
            else:
                pricelist = pool.get('product.pricelist').browse(
                    context['pricelist'])
                context.update({'pricelist': pricelist.id})
                from_currency = pool['res.users'].sudo().browse(
                    SUPERUSER_ID).company_id.currency_id
                to_currency = pricelist.currency_id

            def compute_currency(price):
                return pool['res.currency']._convert(
                    price, from_currency, to_currency, fields.Date.today())

            values = {
                'slider_header': slider_header,
                'compute_currency': compute_currency,
            }
            if slider_header.prod_cat_type == 'product':
                values.update({'slider_details': slider_header.collections_product})
            if slider_header.prod_cat_type == 'category':
                values.update({'slider_details': slider_header.collections_category})
            website = request.env['website'].get_current_website()
            values.update({'slider_type': slider_header.prod_cat_type, 'website': website})
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            print("values================", values)
            return IrQweb._render("theme_scita.product_category_img_slider_config_view", values)
        return False

    @http.route(['/theme_scita/product_category_slider'], type='json', auth="public", website=True)
    def get_product_category(self):
        slider_options = []
        option = request.env['product.category.img.slider.config'].sudo().search(
            [('active', '=', True)], order="name asc")
        for record in option:
            slider_options.append({'id': record.id,
                                   'name': record.name})
        return slider_options

    @http.route(['/theme_scita/get_current_wishlist'], type='json', auth="public", website=True)
    def get_current_wishlist(self):
        values = request.env['product.wishlist'].with_context(display_default_code=False).current()
        return request.env['ir.ui.view']._render_template("theme_scita.wishlist_products", dict(wishes=values))

    # Dynamic video banner url get start

    @http.route(['/video/video_url_get'],
                type='http', auth='public', website=True)
    def get_video_banner_url(self, **post):
        values = {
            "video_url": post.get('video_url')
        }
        return request.render(
            "theme_scita.sct_dynamic_banner_video_1", values)

    # Dynamic video banner url get End

    @http.route(['/shop/cart/update_custom'], type='json', auth="public", methods=['GET', 'POST'], website=True,
                csrf=False)
    def cart_update_custom(self, product_id, add_qty=1, set_qty=0, **kw):
        """This route is called when adding a product to cart (no options)."""
        sale_order = request.website.sale_get_order(force_create=True)
        if sale_order.state != 'draft':
            request.session['sale_order_id'] = None
            sale_order = request.website.sale_get_order(force_create=True)
        product_custom_attribute_values = None
        if kw.get('product_custom_attribute_values'):
            product_custom_attribute_values = json.loads(kw.get('product_custom_attribute_values'))

        no_variant_attribute_values = None
        if kw.get('no_variant_attribute_values'):
            no_variant_attribute_values = json.loads(kw.get('no_variant_attribute_values'))

        sale_order._cart_update(
            product_id=int(product_id),
            add_qty=add_qty,
            set_qty=set_qty,
            product_custom_attribute_values=product_custom_attribute_values,
            no_variant_attribute_values=no_variant_attribute_values
        )
        return True

    @http.route(['/shop/cart/hover_update'], type='http', auth="public", website=True, sitemap=False)
    def cart_hover_update(self, **kw):
        order = request.website.sale_get_order()
        values = {
            'website_sale_order': order,
        }
        return request.render("theme_scita.hover_total", values, headers={'Cache-Control': 'no-cache'})

    @http.route("/shop/variant_change", auth="public", website=True, type='json', methods=['POST'])
    def on_variant_change(self, pro_id):
        product = request.env['product.product'].sudo().search(
            [('id', '=', int(pro_id))])
        values = {
            'is_default_code_disp': request.website.is_default_code,
            'default_code': product.default_code,
        }
        return values

    @http.route(['/theme_scita/trending_products_categories'], type="http", auth="public", website=True)
    def scita_get_trending_products_categories(self, **post):
        slider_id = int(post.get('slider-id'))
        configuration_ids = request.env['trending.products.configuration'].sudo().search([('id', '=', slider_id)])
        all_categories = configuration_ids.category_ids
        values = {
            'trending_products_categories_details': all_categories,
        }
        return request.render("theme_scita.theme_scita_trending_products_view", values)

    @http.route(['/theme_scita/get_trending_prducts'], type="http", auth="public", website=True)
    def scita_get_trending_products(self, **post):
        slider_id = int(post.get('slider-id'))
        configuration_ids = request.env['trending.products.configuration'].sudo().search([('id', '=', slider_id)])
        all_categories = configuration_ids.category_ids
        category_id = post.get("category") if post.get("category") else None
        category_products = request.env['product.template'].search([('public_categ_ids', 'in', int(category_id))])
        values = {
            'trending_products_categories_details': all_categories,
            "product_details": category_products,
            'config': configuration_ids,
        }
        return request.render("theme_scita.theme_scita_trending_products_view", values)

    @http.route(['/theme_scita/trending_category_get_options'], type='json', auth="public", website=True)
    def trending_category_get_options(self):
        slider_options = []
        option = request.env['trending.products.configuration'].search(
            [('active', '=', True)], order="name asc")
        for record in option:
            slider_options.append({'id': record.id,
                                   'name': record.name})
        return slider_options

    @http.route(['/lazy/load'], type='json', auth="public", methods=['POST'], website=True)
    def lazy_load(self, category=None, search='', min_price=0.0, max_price=0.0, ppg=False, **post):
        if post.get('category_selected'):
            category = post.get('category_selected')
        if not request.website.has_ecommerce_access():
            return request.redirect('/web/login')
        try:
            min_price = float(min_price)
        except ValueError:
            min_price = 0
        try:
            max_price = float(max_price)
        except ValueError:
            max_price = 0
        pass

        Category = request.env['product.public.category']
        if category:
            category = Category.search([('id', '=', int(category))], limit=1)
            if not category or not category.can_access_from_current_website():
                raise NotFound()
        else:
            category = Category

        website = request.env['website'].get_current_website()
        website_domain = website.website_domain()
        if ppg:
            try:
                ppg = int(ppg)
                post['ppg'] = ppg
            except ValueError:
                ppg = False
        if not ppg:
            ppg = website.shop_ppg or 20

        ppr = website.shop_ppr or 4

        gap = website.shop_gap or "16px"

        request_args = request.httprequest.args
        attrib_list = request_args.getlist('attribute_value')
        attrib_values = [[int(x) for x in v.split("-")] for v in attrib_list if v]
        attributes_ids = {v[0] for v in attrib_values}
        attrib_set = {v[1] for v in attrib_values}

        filter_by_tags_enabled = website.is_view_active('website_sale.filter_products_tags')
        if filter_by_tags_enabled:
            tags = request_args.getlist('tags')
            if tags and all(tag.isnumeric() for tag in tags):
                post['tags'] = tags
                tags = {int(tag) for tag in tags}
            else:
                post['tags'] = None
                tags = {}

        keep = QueryURL('/shop',
                        **self._shop_get_query_url_kwargs(category and int(category), search, min_price, max_price,
                                                          **post))

        now = datetime.timestamp(datetime.now())
        pricelist = website.pricelist_id

        if 'website_sale_pricelist_time' in request.session:
            pricelist_save_time = request.session['website_sale_pricelist_time']
            if pricelist_save_time < now - 60 * 60:
                request.session.pop('website_sale_current_pl', None)
                website.invalidate_recordset(['pricelist_id'])
                pricelist = website.pricelist_id
                request.session['website_sale_pricelist_time'] = now
                request.session['website_sale_current_pl'] = pricelist.id
        else:
            request.session['website_sale_pricelist_time'] = now
            request.session['website_sale_current_pl'] = pricelist.id

        filter_by_price_enabled = website.is_view_active('website_sale.filter_products_price')
        if filter_by_price_enabled:
            company_currency = website.company_id.sudo().currency_id
            conversion_rate = request.env['res.currency']._get_conversion_rate(
                company_currency, website.currency_id, request.website.company_id, fields.Date.today())
        else:
            conversion_rate = 1

        url = '/shop'
        if search:
            post['search'] = search

        options = self._get_search_options(
            category=category,
            attrib_values=attrib_values,
            min_price=min_price,
            max_price=max_price,
            conversion_rate=conversion_rate,
            display_currency=website.currency_id,
            **post
        )
        fuzzy_search_term, product_count, search_product = self._shop_lookup_products(attrib_set, options, post, search,
                                                                                      website)
        filter_by_price_enabled = website.is_view_active('website_sale.filter_products_price')
        if filter_by_price_enabled:
            Product = request.env['product.template'].with_context(bin_size=True)
            domain = self._get_shop_domain(search, category, attrib_values)

            query = Product._where_calc(domain)
            Product._apply_ir_rules(query, 'read')
            sql = query.select(
                SQL(
                    "COALESCE(MIN(list_price), 0) * %(conversion_rate)s, COALESCE(MAX(list_price), 0) * %(conversion_rate)s",
                    conversion_rate=conversion_rate,
                )
            )
            available_min_price, available_max_price = request.env.execute_query(sql)[0]

            if min_price or max_price:
                if min_price:
                    min_price = min_price if min_price <= available_max_price else available_min_price
                    post['min_price'] = min_price
                if max_price:
                    max_price = max_price if max_price >= available_min_price else available_max_price
                    post['max_price'] = max_price

        ProductTag = request.env['product.tag']
        if filter_by_tags_enabled and search_product:
            all_tags = ProductTag.search(
                expression.AND([
                    [('product_ids.is_published', '=', True), ('visible_on_ecommerce', '=', True)],
                    website_domain
                ])
            )
        else:
            all_tags = ProductTag

        categs_domain = [('parent_id', '=', False)] + website_domain
        if search:
            search_categories = Category.search(
                [('product_tmpl_ids', 'in', search_product.ids)] + website_domain
            ).parents_and_self
            categs_domain.append(('id', 'in', search_categories.ids))
        else:
            search_categories = Category
        categs = lazy(lambda: Category.search(categs_domain))

        if category:
            url = "/shop/category/%s" % request.env['ir.http']._slug(category)

        pager = website.pager(url=url, total=product_count, page=1, step=ppg, scope=5, url_args=post)
        # offset = pager['offset']
        offset = post.get("offset", 0)
        products = search_product[offset:offset + ppg]

        ProductAttribute = request.env['product.attribute']
        if products:
            attributes = lazy(lambda: ProductAttribute.search([
                ('product_tmpl_ids', 'in', search_product.ids),
                ('visibility', '=', 'visible'),
            ]))
        else:
            attributes = lazy(lambda: ProductAttribute.browse(attributes_ids))

        layout_mode = request.session.get('website_sale_shop_layout_mode')
        if not layout_mode:
            if website.viewref('website_sale.products_list_view').active:
                layout_mode = 'list'
            else:
                layout_mode = 'grid'
            request.session['website_sale_shop_layout_mode'] = layout_mode

        products_prices = lazy(lambda: products._get_sales_prices(website))

        attributes_values = request.env['product.attribute.value'].browse(attrib_set)
        sorted_attributes_values = attributes_values.sorted('sequence')
        multi_attributes_values = sorted_attributes_values.filtered(lambda av: av.display_type == 'multi')
        single_attributes_values = sorted_attributes_values - multi_attributes_values
        grouped_attributes_values = list(groupby(single_attributes_values, lambda av: av.attribute_id.id))
        grouped_attributes_values.extend([(av.attribute_id.id, [av]) for av in multi_attributes_values])

        selected_attributes_hash = grouped_attributes_values and "#attribute_values=%s" % (
            ','.join(str(v[0].id) for k, v in grouped_attributes_values)
        ) or ''

        values = {
            'search': fuzzy_search_term or search,
            'original_search': fuzzy_search_term and search,
            'order': post.get('order', ''),
            'category': category,
            'attrib_values': attrib_values,
            'attrib_set': attrib_set,
            'pager': pager,
            'products': products,
            'search_product': search_product,
            'search_count': product_count,  # common for all searchbox
            'bins': lazy(lambda: TableCompute().process(products, ppg, ppr)),
            'ppg': ppg,
            'ppr': ppr,
            'gap': gap,
            'categories': categs,
            'attributes': attributes,
            'keep': keep,
            'selected_attributes_hash': selected_attributes_hash,
            'search_categories_ids': search_categories.ids,
            'layout_mode': layout_mode,
            'products_prices': products_prices,
            'get_product_prices': lambda product: lazy(lambda: products_prices[product.id]),
            'float_round': float_round,
        }
        if filter_by_price_enabled:
            values['min_price'] = min_price or available_min_price
            values['max_price'] = max_price or available_max_price
            values['available_min_price'] = float_round(available_min_price, 2)
            values['available_max_price'] = float_round(available_max_price, 2)
        if filter_by_tags_enabled:
            values.update({'all_tags': all_tags, 'tags': tags})
        if category:
            values['main_object'] = category
        values.update(self._get_additional_extra_shop_values(values, **post))

        data_grid = request.env['ir.ui.view']._render_template("theme_scita.lazy_product_item", values)
        return {'count': len(products), 'data_grid': data_grid}


class PWASupport(http.Controller):

    def get_asset_urls(self, asset_xml_id):
        env = request.env
        qweb = request.env["ir.qweb"].sudo()
        files, _ = qweb._get_asset_content(asset_xml_id)
        assets = AssetsBundle(asset_xml_id, files, env=env)
        urls = []
        for asset in assets.files:
            urls.append(asset['url'])
        return urls

    @http.route("/service_worker", type="http", auth="public")
    def service_worker(self):
        qweb = request.env["ir.qweb"].sudo()
        urls = []
        prefetch_urls = []
        urls.extend(self.get_asset_urls("web.assets_common"))
        urls.extend(self.get_asset_urls("web.assets_frontend"))
        version_list = []
        for url in urls:
            version_list.append(url.split("/")[3])
        cache_version = "-".join(version_list)
        mimetype = "text/javascript;charset=utf-8"
        prefetch_urls.append('/')
        prefetch_urls.append('/theme_scita/pwa/offline')
        prefetch_urls.append('/theme_scita/static/src/img/PWA/network-error.png')
        content = qweb._render(
            "theme_scita.pwa_service_worker",
            {"pwa_cache_version": cache_version, "urls_to_cache": prefetch_urls},
        )
        return request.make_response(content, [("Content-Type", mimetype)])

    @http.route("/theme_scita/manifest_file/<int:website_id>", type="http", auth="public")
    def pwa_manifest(self, website_id=None):
        # website = request.env['website'].get_current_website()
        website = request.env['website']
        current_website = website.search(
            [('id', '=', website_id)]) if website_id else website.get_current_website()
        qweb = request.env["ir.qweb"].sudo().with_context(website_id=current_website.id,
                                                          lang=current_website.default_lang_id.code)
        pwa_app_name = current_website.pwa_app_name or 'PWA App'
        pwa_app_short_name = current_website.pwa_app_short_name or 'PWA Application'
        image_72 = website.image_url(current_website, 'pwa_app_icon_512', '72x72')
        image_96 = website.image_url(current_website, 'pwa_app_icon_512', '96x96')
        image_128 = website.image_url(current_website, 'pwa_app_icon_512', '128x128')
        image_144 = website.image_url(current_website, 'pwa_app_icon_512', '144x144')
        image_152 = website.image_url(current_website, 'pwa_app_icon_512', '152x152')
        image_192 = website.image_url(current_website, 'pwa_app_icon_512', '192x192')
        image_256 = website.image_url(current_website, 'pwa_app_icon_512', '256x256')
        image_384 = website.image_url(current_website, 'pwa_app_icon_512', '384x384')
        image_512 = website.image_url(current_website, 'pwa_app_icon_512', '512x512')
        back_color = current_website.pwa_app_back_color or '#7C7BAD'
        theme_color = current_website.pwa_app_theme_color or '#ffffff'
        start_url = current_website.pwa_app_start_url or '/shop'
        mimetype = "application/json;charset=utf-8"
        content = qweb._render(
            "theme_scita.manifest_temp",
            {
                "pwa_name": pwa_app_name,
                "pwa_short_name": pwa_app_short_name,
                "image_72": image_72,
                "image_96": image_96,
                "image_128": image_128,
                "image_144": image_144,
                "image_152": image_152,
                "image_192": image_192,
                "image_256": image_256,
                "image_384": image_384,
                "image_512": image_512,
                "start_url": start_url,
                "background_color": back_color,
                "theme_color": theme_color,
            },
        )
        return request.make_response(content, [("Content-Type", mimetype)])

    @http.route("/theme_scita/pwa/offline", type="http", auth="public", website=True)
    def pwa_offline_page(self):
        values = {}
        return request.render("theme_scita.pwa_offline_template", values)

    @http.route("/theme_scita/shop/quick_view", type="json", auth="public", website=True)
    def scita_quick_view_data(self, product_id=None):
        product = request.env['product.template'].browse(int(product_id))

        return request.env['ir.ui.view']._render_template("theme_scita.shop_quick_view_modal", {'product': product})

    @http.route("/theme_scita/shop/cart_view", type="json", auth="public", website=True)
    def scita_cart_view_data(self, product_id=None):
        product = request.env['product.template'].browse(int(product_id))
        return request.env['ir.ui.view']._render_template("theme_scita.shop_cart_view_modal", {'product': product})

    @http.route(['/deal/deal_of_the_day_new'], type='json', auth='public', website=True)
    def deal_of_the_day_new(self, **post):
        if post.get('slider-deal'):
            deal_header = request.env['biztech.deal.of.the.day.configuration'].sudo().search(
                [('id', '=', int(post.get('slider-deal')))])
            values = {
                'deal': deal_header,
            }
            website = request.env['website'].get_current_website()
            IrQweb = request.env['ir.qweb'].with_context(website_id=website.id, lang=website.default_lang_id.code)
            return IrQweb._render("theme_scita.theme_scita_deal_of_the_day_view", values)

    # @http.route(['/playground'], type='http', auth="public", website=True)
    # def playground(self, **kw):
    #     # You can pass data if needed
    #     return request.render("theme_scita.playground_template", {})
