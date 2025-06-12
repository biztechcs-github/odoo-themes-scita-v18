from odoo import http
from odoo.http import request

class ImageHotspotController(http.Controller):

    @http.route('/theme_scita/hotspot', type='json', auth="public", website=True)
    def hotspot_get_options(self):
        slider_options = []
        option = request.env['image.hotspot'].search([], order="name asc")
        for record in option:
            slider_options.append({'id': record.id,
                                   'name': record.name})
        return slider_options
