# -*- coding: utf-8 -*-
# Part of AppJetty. See LICENSE file for full copyright and
# licensing details.

import re
import math
from werkzeug.exceptions import Forbidden, NotFound
from odoo import http, SUPERUSER_ID, fields
from odoo.http import request
from odoo.addons.http_routing.models.ir_http import slug
from odoo.addons.website_sale.controllers import main
from odoo.addons.website_sale.controllers import main as main_shop
from odoo.addons.website.controllers.main import QueryURL
from odoo.addons.website_sale.controllers.main import WebsiteSale
from odoo.addons.website_sale.controllers.main import TableCompute
from odoo.addons.web_editor.controllers.main import Web_Editor


class ThememobicraftSliderSettings(http.Controller):

    @http.route(['/theme_mobicraft/pro_get_options'], type='json', auth="public", website=True)
    def get_slider_options(self):
        slider_options = []
        option = request.env['mobicraft.product.slider.config'].sudo().search(
            [('active', '=', True)], order="name asc")
        for record in option:
            slider_options.append({'id': record.id,
                                   'name': record.name})
        return slider_options

    @http.route(['/theme_mobicraft/pro_get_dynamic_slider'], type='http', auth='public', website=True)
    def get_dynamic_slider(self, **post):
        uid, context, pool = request.uid, dict(request.context), request.env
        if post.get('slider-type'):
            slider_header = request.env['mobicraft.product.slider.config'].sudo().search(
                [('id', '=', int(post.get('slider-type')))])

            if not context.get('pricelist'):
                pricelist = request.website.get_current_pricelist()
                context = dict(request.context, pricelist=int(pricelist))
            else:
                pricelist = pool.get('product.pricelist').sudo().browse(
                    context['pricelist'])

            context.update({'pricelist': pricelist.id})

            from_currency = pool['res.users'].sudo().browse(
                uid).company_id.currency_id
            to_currency = pricelist.currency_id

            def compute_currency(price): return pool['res.currency']._convert(
                price, from_currency, to_currency, fields.Date().today())

            values = {
                'slider_header': slider_header,
                'slider_details': slider_header.collections_product,
                'compute_currency': compute_currency,
            }
            return request.render("theme_mobicraft.theme_mobicraft_pro_cat_slider_view", values)

    @http.route(['/theme_mobicraft/pro_image_effect_config'], type='json', auth='public', website=True)
    def product_image_dynamic_slider(self, **post):
        slider_data = request.env['mobicraft.product.slider.config'].sudo().search(
            [('id', '=', int(post.get('slider_type')))])
        values = {
            's_id': slider_data.id,
            'counts': slider_data.no_of_counts,
            'auto_rotate': slider_data.auto_rotate,
            'auto_play_time': slider_data.sliding_speed,
        }
        return values

    @http.route(['/theme_mobicraft/blog_get_options'], type='json', auth="public", website=True)
    def king_blog_get_slider_options(self):
        slider_options = []
        option = request.env['mobicraft.blog.slider.config'].sudo().search(
            [('active', '=', True)], order="name asc")
        for record in option:
            slider_options.append({'id': record.id,
                                   'name': record.name})
        return slider_options

    @http.route(['/theme_mobicraft/blog_get_dynamic_slider'], type='http', auth='public', website=True)
    def king_blog_get_dynamic_slider(self, **post):
        if post.get('slider-type'):
            slider_header = request.env['mobicraft.blog.slider.config'].sudo().search(
                [('id', '=', int(post.get('slider-type')))])

            values = {
                'slider_header': slider_header,
                'blog_slider_details': slider_header.collections_blog_post,
            }
            return request.render("theme_mobicraft.theme_mobicraft_blog_slider_view", values)

    @http.route(['/theme_mobicraft/blog_image_effect_config'], type='json', auth='public', website=True)
    def king_blog_product_image_dynamic_slider(self, **post):
        slider_data = request.env['mobicraft.blog.slider.config'].sudo().search(
            [('id', '=', int(post.get('slider_type')))])
        values = {
            's_id': slider_data.no_of_counts + '-' + str(slider_data.id),
            'counts': slider_data.no_of_counts,
            'auto_rotate': slider_data.auto_rotate,
            'auto_play_time': slider_data.sliding_speed,
        }
        return values

    # Multi image gallery
    @http.route(['/theme_mobicraft/multi_image_effect_config'], type='json', auth="public", website=True)
    def get_multi_image_effect_config(self):
        cur_website = request.website
        values = {
            'no_extra_options': cur_website.no_extra_options,
            'theme_panel_position': cur_website.thumbnail_panel_position,
            'interval_play': cur_website.interval_play,
            'enable_disable_text': cur_website.enable_disable_text,
            'color_opt_thumbnail': cur_website.color_opt_thumbnail,
            'change_thumbnail_size': cur_website.change_thumbnail_size,
            'thumb_height': cur_website.thumb_height,
            'thumb_width': cur_website.thumb_width,
        }
        return values

    @http.route(['/theme_mobicraft/category_image_effect_config'], type='json', auth='public', website=True)
    def category_image_dynamic_slider(self, **post):
        slider_data = request.env['mobicraft.category.slider.config'].sudo().search(
            [('id', '=', int(post.get('slider_id')))])
        values = {
            's_id': slider_data.name.lower().replace(' ', '-') + '-' + str(slider_data.id),
            'counts': slider_data.no_of_counts,
            'auto_rotate': slider_data.auto_rotate,
            'auto_play_time': slider_data.sliding_speed,
        }
        return values

    @http.route(['/theme_mobicraft/category_get_dynamic_slider'], type='http', auth='public', website=True)
    def category_get_dynamic_slider(self, **post):
        if post.get('slider-id'):
            slider_header = request.env['mobicraft.category.slider.config'].sudo().search(
                [('id', '=', int(post.get('slider-id')))])
            values = {
                'slider_header': slider_header
            }
            for category in slider_header.collections_category:
                cat_parent = request.env['product.public.category'].sudo().search(
                    [('parent_id', '=', category.id)])
                total_count = []
                if cat_parent:
                    for cat in cat_parent:
                        query = """
                            SELECT
                                id
                            FROM
                                product_template
                            WHERE id in (
                                SELECT product_template_id
                                FROM product_public_category_product_template_rel
                                WHERE product_public_category_id in %s);
                            """
                        request.env.cr.execute(query, (tuple([cat.id]),))
                        prod_count = request.env.cr.fetchall()
                        if prod_count:
                            total_count += prod_count

                query = """
                        SELECT
                            id
                        FROM
                            product_template
                        WHERE id in (
                            SELECT product_template_id
                            FROM product_public_category_product_template_rel
                            WHERE product_public_category_id in %s);
                        """
                request.env.cr.execute(query, (tuple([category.id]),))
                prod_count = request.env.cr.fetchall()
                if prod_count:
                    total_count += prod_count

                final_count = {}
                for x in total_count:
                    final_count[x] = 1
                category.linked_product_count = sum(list(final_count.values()))

            values.update({
                'slider_details': slider_header.collections_category,
            })
            return request.render("theme_mobicraft.theme_mobicraft_cat_slider_view", values)

    # For multi product slider
    @http.route(['/theme_mobicraft/product_multi_get_options'], type='json', auth="public", website=True)
    def product_multi_get_slider_options(self):
        slider_options = []
        option = request.env['mobicraft.multi.slider.config'].sudo().search(
            [('active', '=', True)], order="name asc")
        for record in option:
            slider_options.append({'id': record.id,
                                   'name': record.name})
        return slider_options

    @http.route(['/theme_mobicraft/category_get_options'], type='json', auth="public", website=True)
    def category_get_slider_options(self):
        slider_options = []
        option = request.env['mobicraft.category.slider.config'].sudo().search(
            [('active', '=', True)], order="name asc")
        for record in option:
            slider_options.append({'id': record.id,
                                   'name': record.name})
        return slider_options

    @http.route(['/theme_mobicraft/product_multi_get_dynamic_slider'], type='http', auth='public', website=True)
    def product_multi_get_dynamic_slider(self, **post):
        context, pool = dict(request.context), request.env
        if post.get('slider-type'):
            slider_header = request.env['mobicraft.multi.slider.config'].sudo().search(
                [('id', '=', int(post.get('slider-type')))])

            if not context.get('pricelist'):
                pricelist = request.website.get_current_pricelist()
                context = dict(request.context, pricelist=int(pricelist))
            else:
                pricelist = pool.get('product.pricelist').browse(
                    context['pricelist'])

            context.update({'pricelist': pricelist.id})
            from_currency = pool['res.users'].sudo().browse(
                SUPERUSER_ID).company_id.currency_id
            to_currency = pricelist.currency_id

            def compute_currency(price): return pool['res.currency']._convert(
                price, from_currency, to_currency, fields.Date().today())

            values = {
                'slider_details': slider_header,
                'slider_header': slider_header,
                'compute_currency': compute_currency,
            }

            return request.render("theme_mobicraft.theme_mobicraft_multi_cat_slider_view", values)

    @http.route(['/theme_mobicraft/product_multi_image_effect_config'], type='json', auth='public', website=True)
    def product_multi_product_image_dynamic_slider(self, **post):
        slider_data = request.env['mobicraft.multi.slider.config'].sudo().search(
            [('id', '=', int(post.get('slider_type')))])
        values = {
            's_id': slider_data.no_of_collection + '-' + str(slider_data.id),
            'counts': slider_data.no_of_collection,
            'auto_rotate': slider_data.auto_rotate,
            'auto_play_time': slider_data.sliding_speed,
        }
        return values

    # For Featured Product slider
    @http.route(['/theme_mobicraft/featured_product_get_options'], type='json', auth="public", website=True)
    def featured_product_get_slider_options(self):
        slider_options = []
        option = request.env['mobicraft.feature.product.slider.config'].sudo().search(
            [('active', '=', True)], order="name asc")
        for record in option:
            slider_options.append({'id': record.id,
                                   'name': record.name})
        return slider_options

    @http.route(['/theme_mobicraft/featured_product_get_dynamic_slider'], type='http', auth='public', website=True)
    def featured_product_get_dynamic_slider(self, **post):
        pool = request.env
        context = dict(request.context)
        if post.get('slider-id'):
            slider_header = request.env['mobicraft.feature.product.slider.config'].sudo().search(
                [('id', '=', int(post.get('slider-id')))])

            if not context.get('pricelist'):
                pricelist = request.website.get_current_pricelist()
                context = dict(request.context, pricelist=int(pricelist))
            else:
                pricelist = pool.get('product.pricelist').browse(
                    context['pricelist'])

            context.update({'pricelist': pricelist.id})

            from_currency = pool['res.users'].sudo().browse(
                SUPERUSER_ID).company_id.currency_id
            to_currency = pricelist.currency_id

            def compute_currency(price): return pool['res.currency']._convert(
                price, from_currency, to_currency, fields.Date().today())

            values = {
                'slider_header': slider_header,
                'compute_currency': compute_currency,
            }
            return request.render("theme_mobicraft.theme_mobicraft_featured_product_slider_view", values)

    @http.route(['/theme_mobicraft/featured_product_image_effect_config'], type='json', auth='public', website=True)
    def featured_product_image_dynamic_slider(self, **post):
        slider_data = request.env['mobicraft.feature.product.slider.config'].sudo().search(
            [('id', '=', int(post.get('slider_id')))])
        values = {
            's_id': slider_data.name.lower().replace(' ', '-') + '-' + str(slider_data.id),
            'counts': slider_data.no_of_counts,
            'auto_rotate': slider_data.auto_rotate,
            'auto_play_time': slider_data.sliding_speed,
        }
        return values


class ThememobicraftBrandSlider(WebsiteSale):

    @http.route(['/shop/pager_selection/<model("product.per.page.no"):pl_id>'], type='http', auth="public", website=True)
    def product_page_change(self, pl_id, **post):
        request.session['default_paging_no'] = pl_id.name
        main.PPG = pl_id.name
        return request.redirect('/shop' or request.httprequest.referrer)

    @http.route([
        '''/shop''',
        '''/shop/page/<int:page>''',
        '''/shop/category/<model("product.public.category"):category>''',
        '''/shop/category/<model("product.public.category"):category>/page/<int:page>''',
        '''/shop/brands'''
    ], type='http', auth="public", website=True, sitemap=WebsiteSale.sitemap_shop)
    def shop(self, page=0, category=None, brand=None, search='', ppg=False, **post):
        context, pool = request.context, request.env
        if request.env['website'].sudo().get_current_website().theme_id.name == 'theme_mobicraft':
            result = super(ThememobicraftBrandSlider, self).shop(
                page=page, category=category, brand=brand, search=search, ppg=ppg, **post)
            add_qty = int(post.get('add_qty', 1))
            Category = request.env['product.public.category']
            if category:
                category = Category.search(
                    [('id', '=', int(category))], limit=1)
                if not category or not category.can_access_from_current_website():
                    raise NotFound()
            else:
                category = Category
            if brand:
                req_ctx = request.context.copy()
                req_ctx.setdefault('brand_id', int(brand))
                request.context = req_ctx
            sort_order = ""
            cat_id = []
            page_no = request.env['product.per.page.no'].sudo().search(
                [('set_default_check', '=', True)])
            if page_no:
                ppg = page_no.name
            else:
                ppg = request.env['website'].get_current_website(
                ).shop_ppg or 20

            ppr = request.env['website'].get_current_website().shop_ppr or 4
            attrib_list = request.httprequest.args.getlist('attrib')
            attrib_values = [[int(x) for x in v.split("-")]
                             for v in attrib_list if v]
            attributes_ids = {v[0] for v in attrib_values}
            attrib_set = {v[1] for v in attrib_values}

            domain = self._get_search_domain(search, category, attrib_values)
            url = "/shop"
            keep = QueryURL('/shop', category=category and int(category),
                            search=search, attrib=attrib_list, order=post.get('order'))

            pricelist_context, pricelist = self._get_pricelist_context()
            if post:
                request.session.update(post)

            if search:
                post["search"] = search

            if attrib_list:
                post['attrib'] = attrib_list
            Product = request.env['product.template'].with_context(
                bin_size=True)
            prevurl = request.httprequest.referrer
            if prevurl:
                if not re.search('/shop', prevurl, re.IGNORECASE):
                    request.session['tag'] = ""
                    request.session['sort_id'] = ""
                    request.session['sortid'] = ""
                    request.session['pricerange'] = ""
                    request.session['min1'] = ""
                    request.session['max1'] = ""
                    request.session['curr_category'] = ""

            session = request.session
            cate_for_price = None
            # for tag filter
            if session.get('tag'):
                session_tag = session.get('tag')
                if isinstance(session_tag, list):
                    tag = session_tag[0]
                else:
                    tag = session_tag
                tags_obj = pool['biztech.product.tags']
                tags_ids = tags_obj.search([])
                tags = tags_obj.browse(tags_ids)
                if tag:
                    tag = pool['biztech.product.tags'].sudo().browse(int(tag))
                    domain += [('biztech_tag_ids', '=', int(tag))]
                    request.session["tag"] = [tag.id, tag.name]

            # For Product Sorting
            if session.get('sort_id'):
                session_sort = session.get('sort_id')
                sort = session_sort
                sorts_obj = pool['biztech.product.sortby'].sudo()
                sorts_ids = sorts_obj.search([], )
                sorts = sorts_obj.browse(sorts_ids)
                sort_field = pool['biztech.product.sortby'].sudo().browse(
                    int(sort))
                request.session['product_sort_name'] = sort_field.name
                order_field = sort_field.sort_on.name
                order_type = sort_field.sort_type
                sort_order = 'is_published desc, %s %s' % (order_field, order_type)
                if post.get("sort_id"):
                    request.session["sortid"] = [
                        sort, sort_order, sort_field.name, order_type]
           # For Price slider
            is_price_slider = request.website.viewref(
                'theme_mobicraft.theme_mobicraft_slider_layout')
            if is_price_slider:

                is_discount_hide = True if request.website.get_current_pricelist(
                ).discount_policy == 'with_discount' or request.website.get_current_pricelist().discount_policy == 'without_discount' else False

                product_slider_ids = []
                asc_product_slider_ids = Product.search(
                    domain, limit=1, order='list_price')
                desc_product_slider_ids = Product.search(
                    domain, limit=1, order='list_price desc')
                if asc_product_slider_ids:
                    product_slider_ids.append(
                        asc_product_slider_ids.price if is_discount_hide else asc_product_slider_ids.list_price)
                if desc_product_slider_ids:
                    product_slider_ids.append(
                        desc_product_slider_ids.price if is_discount_hide else desc_product_slider_ids.list_price)

                if product_slider_ids:
                    if post.get("range1") or post.get("range2") or not post.get("range1") or not post.get("range2"):
                        range1 = min(product_slider_ids)
                        range2 = max(product_slider_ids)
                        result.qcontext['range1'] = math.floor(range1)
                        result.qcontext['range2'] = math.ceil(range2)

                        if request.session.get('pricerange'):
                            if cate_for_price and request.session.get('curr_category') and request.session.get('curr_category') != int(cate_for_price):
                                request.session["min1"] = math.floor(range1)
                                request.session["max1"] = math.ceil(range2)

                        if session.get("min1") and session["min1"]:
                            post["min1"] = session["min1"]
                        if session.get("max1") and session["max1"]:
                            post["max1"] = session["max1"]
                        if range1:
                            post["range1"] = range1
                        if range2:
                            post["range2"] = range2
                        if range1 == range2:
                            post['range1'] = 0.0

                    if request.session.get('min1') or request.session.get('max1'):
                        if request.session.get('min1'):
                            if request.session['min1'] != None:
                                if is_discount_hide:
                                    price_product_list = []
                                    product_withprice = Product.search(
                                        domain)
                                    for prod_id in product_withprice:
                                        if prod_id.price >= float(request.session['min1']) and prod_id.price <= float(request.session['max1']):
                                            price_product_list.append(
                                                prod_id.id)

                                    if price_product_list:
                                        domain += [('id', 'in',
                                                    price_product_list)]
                                    else:
                                        domain += [('id', 'in', [])]
                                else:
                                    domain += [('list_price', '>=', request.session.get('min1')),
                                               ('list_price', '<=', request.session.get('max1'))]

                                request.session["pricerange"] = str(
                                    request.session['min1'])+"-To-"+str(request.session['max1'])

                    if session.get('min1') and session['min1']:
                        result.qcontext['min1'] = session["min1"]
                        result.qcontext['max1'] = session["max1"]

            if cate_for_price:
                request.session['curr_category'] = int(cate_for_price)

            if request.session.get('default_paging_no'):
                ppg = int(request.session.get('default_paging_no'))
            search_product = Product.search(domain)
            website_domain = request.website.website_domain()
            categs_domain = [('parent_id', '=', False)] + website_domain
            if search:
                search_categories = Category.search(
                    [('product_tmpl_ids', 'in', search_product.ids)] + website_domain).parents_and_self
                categs_domain.append(('id', 'in', search_categories.ids))
            else:
                search_categories = Category
            categs = Category.search(categs_domain)

            if category:
                url = "/shop/category/%s" % slug(category)

            product_count = len(search_product)
            pager = request.website.pager(
                url=url, total=product_count, page=page, step=ppg, scope=7, url_args=post)
            products = Product.search(
                domain, limit=ppg, offset=pager['offset'], order=sort_order or self._get_search_order(post))

            ProductAttribute = request.env['product.attribute']
            if products:
                # get all products without limit
                attributes = ProductAttribute.search(
                    [('product_tmpl_ids', 'in', search_product.ids)])
            else:
                attributes = ProductAttribute.browse(attributes_ids)

            layout_mode = request.session.get('website_sale_shop_layout_mode')
            if not layout_mode:
                if request.website.viewref('website_sale.products_list_view').active:
                    layout_mode = 'list'
                else:
                    layout_mode = 'grid'

            result.qcontext.update({
                'search': search,
                'category': category,
                'attrib_values': attrib_values,
                'attrib_set': attrib_set,
                'pager': pager,
                'pricelist': pricelist,
                'add_qty': add_qty,
                'products': products,
                'search_count': product_count,  # common for all searchbox
                'bins': TableCompute().process(products, ppg, ppr),
                'ppg': ppg,
                'ppr': ppr,
                'categories': categs,
                'attributes': attributes,
                'keep': keep,
                'brand': brand,
                'brand_obj': request.env['product.brands'].sudo().search([('id', '=', brand)]),
                'search_categories_ids': search_categories.ids,
                'layout_mode': layout_mode,
            })
            return result
        else:
            return super(ThememobicraftBrandSlider, self).shop(page=page, category=category, brand=brand, search=search, ppg=ppg, **post)

    
    # @http.route()
    # def cart_update_json(self, product_id, line_id=None, add_qty=None, set_qty=None, display=True):
    #     result = super(ThememobicraftBrandSlider, self).cart_update_json(
    #         product_id, line_id, add_qty, set_qty, display)
    #     order = request.website.sale_get_order()
    #     result.update({'theme_mobicraft.hover_total': request.env['ir.ui.view']._render_template("theme_mobicraft.hover_total", {
    #         'website_sale_order': order})
    #     })
    #     return result

    @http.route(['/mobicraft_theme/get_brand_slider'], type='http', auth='public', website=True)
    def get_brand_slider(self, **post):
        keep = QueryURL('/mobicraft_theme/get_brand_slider', brand_id=[])

        value = {
            'website_brands': False,
            'brand_header': False,
            'keep': keep
        }

        if post.get('brand_count'):
            brand_data = request.env['product.brands'].sudo().search(
                [], limit=int(post.get('brand_count')))
            if brand_data:
                value['website_brands'] = brand_data

        if post.get('brand_label'):
            value['brand_header'] = post.get('brand_label')

        return request.render("theme_mobicraft.theme_mobicraft_brand_slider_view", value)

    @http.route(['/theme_mobicraft/removeattribute'], type='json', auth='public', website=True)
    def remove_selected_attribute(self, **post):
        if post.get("attr_remove"):
            remove = post.get("attr_remove")
            if remove == "pricerange":
                del request.session['min1']
                del request.session['max1']
                request.session[remove] = ''
                return True
            elif remove == "sortid":
                request.session[remove] = ''
                request.session["sort_id"] = ''
                return True
            elif remove == "tag":
                request.session[remove] = ''
                return True
