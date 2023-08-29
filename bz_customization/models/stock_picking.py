# -*- coding: utf-8 -*-

from odoo import models, fields, api, _


class StockiPicking(models.Model):
    _inherit = "stock.picking"

    length = fields.Char('Length', help='All dimensions are in mm')
    width = fields.Char('Width')
    height = fields.Char('Height')

    def get_product_and_analytic_account(self):
        mo_id = self.env['mrp.production'].search([
            ('procurement_group_id', '=', self.group_id.id), ('procurement_group_id', '!=', False)
        ],limit=1)
        vals = {
            'product_name': mo_id.product_id.display_name,
            'analytic_account': mo_id.analytic_account_id.display_name
        }
        return vals
