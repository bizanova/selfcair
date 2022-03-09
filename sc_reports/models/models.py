# -*- coding: utf-8 -*-

from odoo import models, fields, api


class ScReportsPurchaseOrderLine(models.Model):
    _inherit = 'purchase.order.line'

    revision = fields.Integer('Revision')

# class sc_reports(models.Model):
#     _name = 'sc_reports.sc_reports'
#     _description = 'sc_reports.sc_reports'

#     name = fields.Char()
#     value = fields.Integer()
#     value2 = fields.Float(compute="_value_pc", store=True)
#     description = fields.Text()
#
#     @api.depends('value')
#     def _value_pc(self):
#         for record in self:
#             record.value2 = float(record.value) / 100
