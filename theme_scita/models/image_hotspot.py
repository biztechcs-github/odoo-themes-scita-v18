from odoo import models, fields

class ImageHotspot(models.Model):
    _name = 'image.hotspot'
    _description = 'Image Hotspot'

    name = fields.Char(string="Name", required=True)
    hotspot_ids = fields.One2many("image.hotspot.point", "hotspot_id", "Hotspots")


class ImageHotspotPoint(models.Model):
    _name = 'image.hotspot.point'
    _description = 'Image Hotspot Point'

    hotspot_id = fields.Many2one('image.hotspot', required=True, ondelete='cascade')
    x = fields.Float("X Position (%)")
    y = fields.Float("Y Position (%)")
    link = fields.Char("URL")
    color = fields.Char(string="Color", default='#3C3C3C')
    product_id = fields.Many2one(
        'product.template',
        string="Linked Product",
        domain=[('type', 'in', ['product', 'consu'])]
    )
    open_in_new_tab = fields.Boolean("Open in New Tab")
