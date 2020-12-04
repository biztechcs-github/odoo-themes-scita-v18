# -*- coding: utf-8 -*-
# Part of AppJetty. See LICENSE file for full copyright and licensing details.

{
    'name': 'Theme Mobicraft',
    'summary': 'HTML5 Bootstrap Odoo Theme for Mobile eCommerce',
    'description': '''Theme Mobicraft
Mobile industry
Electronics
odoo mobicraft theme
odoo mobile theme
odoo mobile store theme
odoo mobile website theme
odoo mobile ecommerce store theme
openerp mobile ecommerce store theme
mobile store theme for odoo
online mobile store theme for odoo
responsive mobile theme
responsive odoo mobile store theme
responsive mobile store theme for odoo
html5 odoo mobile store theme
customizable odoo mobile store theme
odoo ecommerce theme for mobile website
odoo mobile template
odoo responsive theme for mobile store
mobicraft
mobile theme
odoo mobile theme
html5 theme
responsive theme
ecommerce store
ecommerce theme
html5 ecommerce store
html5 ecommerce theme
custom theme
mobile custom theme
bootstrap theme
    ''',
    'category': 'Theme/Ecommerce',
    'version': '14.0.1.0.0',
    'license': 'OPL-1',
    'author': 'AppJetty',
    'website': 'https://www.appjetty.com',
    'depends': [
        'website_sale',
        'sale_management',
        'mass_mailing',
        'website_blog',
        'website_sale_wishlist',
        'website_sale_comparison',
    ],
    'data': [
        'security/ir.model.access.csv',
        'views/assets.xml',
        'data/mobicraft_image_data.xml',
        'views/product_view.xml',
        'views/slider_view.xml',
        'views/snippets.xml',
        'views/website_config_view.xml',
        'views/theme_customize.xml',
        'data/data.xml',
        'views/theme.xml',
    ],
    'support': 'support@appjetty.com',
    'application': True,
    'live_test_url': 'https://theme-mobicraft.appjetty.com/',
    'images': [
        'static/description/splash-screen.png',
        'static/description/splash-screen_screenshot.png'
    ],
    'price': 109.00,
    'currency': 'EUR',
}
