# -*- coding: utf-8 -*-
# Part of AppJetty. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models

class TopDealersConfiguration(models.Model):
    _name = 'top.dealers.configuration'
    _description = 'Top Dealers Snippet Configuration'
    _order = "sequence asc"

    name = fields.Char(string="Name", help="Name",required=True, translate=True)
    active = fields.Boolean(string="Active", default=True)
    # vendor_id = fields.Many2one("res.partner", string="Vendor")
    vendor_ids = fields.Many2many("res.partner", "top_dealer_res_partner_rel", "dealer_id", "partner_id", string="Vendors")
    # number_of_products = fields.Integer(string="Products")
    sequence = fields.Integer(string="Sequence", default=1)

    # @api.onchange('vendor_id')
    # def onchange_vendor(self):
    #     if self.vendor_id:
    #         self.number_of_products = len(self.env['product.template'].search([('seller_ids', 'ilike', self.vendor_id.name)]))

    @api.onchange('vendor_ids')
    def onchange_vendor_ids(self):
        for vendor in  self.vendor_ids:
            vendor.product_count = len(self.env['product.template'].search([('seller_ids', 'ilike', self.vendor_id.name)]))
