# -*- coding: utf-8 -*-
# from odoo import http


# class ScReports(http.Controller):
#     @http.route('/sc_reports/sc_reports', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/sc_reports/sc_reports/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('sc_reports.listing', {
#             'root': '/sc_reports/sc_reports',
#             'objects': http.request.env['sc_reports.sc_reports'].search([]),
#         })

#     @http.route('/sc_reports/sc_reports/objects/<model("sc_reports.sc_reports"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('sc_reports.object', {
#             'object': obj
#         })
