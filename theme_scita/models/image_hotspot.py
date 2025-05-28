from odoo import models, fields

class ImageHotspot(models.Model):
    _name = 'image.hotspot'
    _description = 'Image Hotspot'

    name = fields.Char(string="Name", required=True)
    image = fields.Image("Image")
    hotspot_ids = fields.One2many("image.hotspot.point", "hotspot_id", "Hotspots")


class ImageHotspotPoint(models.Model):
    _name = 'image.hotspot.point'
    _description = 'Image Hotspot Point'

    hotspot_id = fields.Many2one('image.hotspot', required=True)
    x = fields.Float("X Position (%)")
    y = fields.Float("Y Position (%)")
    link = fields.Char("URL")
