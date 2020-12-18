# -*- coding: utf-8 -*-
# Part of AppJetty. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, _
from odoo.exceptions import Warning
from odoo.addons.website_sale.controllers import main


class Brands(models.Model):
    _name = 'product.brands'
    _description = 'Add products Brand'

    active = fields.Boolean(
        string="Active", default=True, help="""Active true will brand is display""")
    sequence = fields.Integer()
    name = fields.Char(string='Brand Name', required=True, translate=True)
    image = fields.Binary(string='Brand Logo', attachment=True,)
    image_medium = fields.Binary("Medium-sized Image", attachment=True,
                                 help="Medium-sized logo of the brand. It is automatically "
                                 "resized as a 128x128px image, with aspect ratio preserved. "
                                 "Use this field in form views or some kanban views.")
    image_small = fields.Binary("Small-sized Image", attachment=True,
                                help="Small-sized logo of the brand. It is automatically "
                                "resized as a 64x64px image, with aspect ratio preserved. "
                                "Use this field anywhere a small image is required.")
    brand_description = fields.Text(string='Description', translate=True)
    # brand_logo = fields.Binary(string='Brand Logo')
    brand_cover = fields.Binary(string='Brand Cover')
    product_ids = fields.One2many(
        'product.template',
        'product_brand_id',
        string='Product Brands',
    )
    products_count = fields.Integer(
        string='Number of products',
        compute='_get_products_count',
    )

    @api.depends('product_ids')
    def _get_products_count(self):
        for brand in self:
            brand.products_count = len(brand.product_ids)


class ProductStyleTags(models.Model):
    _name = 'biztech.product.style.tag'
    _description = 'Add products style tags'

    name = fields.Char(string='Tag Name', required=True, translate=True)
    color = fields.Selection(
        [('red', 'Red'), ('new', 'Green'), ('sale', 'Orange')], string="Color")
    product_ids = fields.One2many(
        'product.template',
        'product_style_tag_id',
        string='Product Tags',
    )


class KingProductImages(models.Model):
    _name = 'biztech.product.images'
    _description = "Add Multiple Image in Product"

    name = fields.Char(string='Title', translate=True)
    alt = fields.Char(string='Alt', translate=True)
    attach_type = fields.Selection([('image', 'Image'), ('video', 'Video')],
                                   default='image',
                                   string="Type")
    image = fields.Binary(string='Images')
    video_type = fields.Selection([('youtube', 'Youtube'),
                                   ('vimeo', 'Vimeo'),
                                   ('html5video', 'Html5 Video')],
                                  default='youtube',
                                  string="Video media player")
    cover_image = fields.Binary(string='Cover image',
                                # required=True,
                                help="Cover Image will be show untill video is loaded.")
    video_id = fields.Char(string='Video ID')
    video_ogv = fields.Char(
        string='Video OGV', help="Link for ogv format video")
    video_webm = fields.Char(
        string='Video WEBM', help="Link for webm format video")
    video_mp4 = fields.Char(
        string='Video MP4', help="Link for mp4 format video")
    sequence = fields.Integer(string='Sort Order')
    product_tmpl_id = fields.Many2one('product.template', string='Product')
    more_view_exclude = fields.Boolean(string="More View Exclude")


class ProductTemplate(models.Model):
    _inherit = 'product.template'

    product_brand_id = fields.Many2one(
        'product.brands',
        string='Brand',
        help='Select a brand for this product'
    )
    images = fields.One2many('biztech.product.images', 'product_tmpl_id',
                             string='Product Images')
    multi_image = fields.Boolean(string="Add Multiple Images?")
    biztech_tag_ids = fields.Many2many(
        'biztech.product.tags', string="Product Tags")
    product_style_tag_id = fields.Many2one(
        'biztech.product.style.tag',
        string='Tags',
        help='Select a tag for this product'
    )


class ProductTags(models.Model):
    _name = 'biztech.product.tags'
    _order = "sequence"
    _description = "Add Product in tag"

    name = fields.Char(string="Tag Name", help="Tag Name",
                       required=True, translate=True)
    active = fields.Boolean(
        string="Active", help="Enable or Disable tag from website", default=True)
    sequence = fields.Integer(
        string='Sequence', help="You can define sequence of tags you want to show tags")
    product_ids = fields.Many2many(
        'product.template', string='Products', required=True)

    _sql_constraints = [('unique_tag_name', 'unique(name)',
                         'Tag name should be unique..!'), ]


class ProductSortBy(models.Model):
    _name = 'biztech.product.sortby'
    _description = "Add sorting on perticular fields"

    name = fields.Char(string="Name", help='Name for sorting option',
                       required=True, translate=True)
    sort_type = fields.Selection(
        [('asc', 'Ascending'), ('desc', 'Descending')], string="Type", default='asc')
    sort_on = fields.Many2one('ir.model.fields', string='Sort On',
                              help='Select field on which you want to apply sorting',
                              domain=[('model', '=', 'product.template'), ('ttype', 'in', ('char', 'float', 'integer', 'datetime', 'date'))])


class ProductCategory(models.Model):
    _inherit = 'product.public.category'

    linked_product_count = fields.Integer(string='# of Products')
    include_in_megamenu = fields.Boolean(
        string="Include in mega menu", help="Include in mega menu")
    menu_id = fields.Many2one('website.menu', string="Main menu")
    description = fields.Text(string="Description",
                              help="Short description which will be visible below category slider.")


class ProductPerPageNo(models.Model):
    _name = "product.per.page.no"
    _order = 'name asc'
    _description = "Add page no"

    name = fields.Integer(string='Product per page')
    set_default_check = fields.Boolean(string="Set default")
    prod_page_id = fields.Many2one('product.per.page')

    @api.model
    def create(self, vals):
        res = super(ProductPerPageNo, self).create(vals)
        if vals.get('name') == 0:
            raise Warning(
                _("Warning! You cannot set 'zero' for product page."))
        if vals.get('set_default_check'):
            true_records = self.search(
                [('set_default_check', '=', True), ('id', '!=', res.id)])
            true_records.write({'set_default_check': False})
        return res

    def write(self, vals):
        res = super(ProductPerPageNo, self).write(vals)
        if vals.get('name') == 0:
            raise Warning(
                _("Warning! You cannot set 'zero' for product page."))
        if vals.get('set_default_check'):
            true_records = self.search(
                [('set_default_check', '=', True), ('id', '!=', self.id)])
            true_records.write({'set_default_check': False})
        return res


class ProductPerPage(models.Model):
    _name = "product.per.page"
    _description = "Add no of product display in one page"

    name = fields.Char(string="Label Name", translate=True)
    no_ids = fields.One2many(
        'product.per.page.no', 'prod_page_id', string="No of product to display")

    def write(self, vals):
        res = super(ProductPerPage, self).write(vals)
        default_pg = self.env['product.per.page.no'].search(
            [('set_default_check', '=', True)])
        if default_pg.name:
            main.PPG = int(default_pg.name)
        else:
            raise Warning(
                _("Warning! You have to set atleast one default value."))
        return res
