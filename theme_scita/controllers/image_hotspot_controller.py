# controllers/main.py
from odoo import http
from odoo.http import request

class ImageHotspotController(http.Controller):

    @http.route('/hotspot/page', type='http', auth='public', website=True)
    def hotspot_page(self, **kwargs):
        hotspot = request.env['image.hotspot'].sudo().browse(1)
        image_base64 = hotspot.image.decode('utf-8') if hotspot.image else ''
        return request.render('theme_scita.image_hotspot_page', {
            'record': {
                'image': image_base64,
                'hotspot_ids': hotspot.hotspot_ids,
            }
        })
