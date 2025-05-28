from odoo import http
from odoo.http import request

class ImageHotspotController(http.Controller):

    @http.route(['/hotspot/<int:hotspot_id>'], type='http', auth="public", website=True)
    def image_hotspot_view(self, hotspot_id):
        hotspot = request.env['image.hotspot'].sudo().browse(hotspot_id)
        # Ensure the image is Base64-encoded and converted to a string
        image_base64 = hotspot.image.decode('utf-8') if hotspot.image else ''
        return request.render('theme_scita.image_hotspot_template', {
            'record': {
                'image': image_base64,
                'hotspot_ids': hotspot.hotspot_ids,
            }
        })