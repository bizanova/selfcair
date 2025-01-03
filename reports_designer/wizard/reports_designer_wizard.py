# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from datetime import datetime, date
from odoo import api, fields, models, _
from odoo.tools import DEFAULT_SERVER_DATE_FORMAT, DEFAULT_SERVER_DATETIME_FORMAT
from odoo.tools.misc import frozendict
from lxml import etree
import logging
_logger = logging.getLogger(__name__)
class ReportsDesignerWizard(models.TransientModel):
    _name = 'reports_designer_wizard'
    _description = "Report Wizard"
    def _compute_report_name(self):
        return self.env['reports.designer'].search([('id', '=', self.env.context.get('id'))])['name']
    def _compute_report_description(self):
        return self.env['reports.designer'].search([('id', '=', self.env.context.get('id'))])['description']
    def _compute_report_conf(self):
        return self.env.context.get('id')
    report_conf = fields.Many2one('reports.designer', 'Report Excel', required=True, ondelete='cascade', readonly=True, default=_compute_report_conf)
    report_name = fields.Char(string="Report Name", readonly=True, default=_compute_report_name)
    report_description = fields.Text(string="Type of document", readonly=True, default=_compute_report_description)
    data = fields.Serialized()
    def export_excel(self):
        datas = {'ids': self.env.context.get('active_ids', [])}
        datas['active_model'] = self.env.context.get('active_model')
        res = self.read(['report_conf'])
        res = res and res[0] or {}
        if not res:
            return
        res['report_conf_id'] = res['report_conf'][0]
        res_data = self.read(['data'])
        res_data = res_data and res_data[0] or {}
        datas['form'] = res
        datas['form']['data'] = res_data['data']
        datas['send_by_email'] = self.env.context.get('send_by_email')        
        return self.env['reports_designer_gen'].create_xls(datas, CellUtil)
    def wizard_view(self):
        return {'name': _('Report Excel'),
                'view_mode': 'form',
                'view_id': self.env.ref('reports_designer.view_reports_designer_wizard').id,
                'res_model': 'reports_designer_wizard',
                'src_model': 'report',
                'type': 'ir.actions.act_window',
                'target': 'new',
                }
    @api.model
    def create(self, values):
        result = super(ReportsDesignerWizard, self).create(values)
        for key, val in result._fields.items():
            field = val
            key_split = key.split('_')
            if len(key_split) > 2:
                if key_split[0] == 'x' and key_split[1] == 'param' and int(key_split[2]) == self._context.get('id'):
                    field.inverse = 'compute_'
        if len(values):
            for k,v in list(values.items()):
                if k != 'data':
                    self.compute_(self._fields[k], result, v)
        return result
    def write(self, vals):
        record = self
        result = super(ReportsDesignerWizard, self).write(vals)           
        if len(vals):
            for k,v in list(vals.items()):
                if k != 'data':
                    self.compute_(self._fields[k], record, v)
        self._compute(record)
        return result
    def _compute(self, records=None):
        records = self if not records else records
        for record in records:
            for key, val in list(record._fields.items()):
                key_split = key.split('_')
                if len(key_split) > 2:
                    if key_split[0] == 'x' and key_split[1] == 'param' and int(key_split[2]) == record.env.context.get('id'):
                        field = record._fields.get(key)
                        values = record['data']
                        value = values.get(field.name)
                        rec_val = field.convert_to_read(record[field.name], record, use_name_get=False)
                        if type(rec_val) is date:
                            rec_val = rec_val.strftime(DEFAULT_SERVER_DATE_FORMAT)
                        if type(rec_val) is datetime:
                            rec_val = rec_val.strftime(DEFAULT_SERVER_DATETIME_FORMAT)
                        if isinstance(rec_val, list) and value is not None:
                            value.sort()
                            rec_val.sort()
                        if rec_val != value and field.name in values:
                            record[field.name] = [[6, False, values.get(field.name)]] if isinstance(rec_val, list) else values.get(field.name) 
                            if field.relational:
                                record[field.name] = record[field.name].exists()
    def compute_(self, field=None, records=None, val=None):
        if records:
            for record in records:
                values = record['data']
                if isinstance(val, list):
                    value = val[0][2] if val else val
                else:
                    value = val
                if type(val) is date:
                    value = val.strftime(DEFAULT_SERVER_DATE_FORMAT)
                if type(val) is datetime:
                    value = val.strftime(DEFAULT_SERVER_DATETIME_FORMAT)
                if value:
                    if isinstance(value, list) and values.get(field.name) is not None:
                        if sorted(values.get(field.name)) != sorted(value):
                            values[field.name] = value
                            record['data'] = values
                    else:
                        if values.get(field.name) != value:
                            values[field.name] = value
                            record['data'] = values
                else:
                    if field.name in values:
                        values.pop(field.name)
                        record['data'] = values
    @api.model
    def get_view(self, view_id=None, view_type='form', **options):
        res = super(ReportsDesignerWizard, self).get_view(view_id, view_type, **options)
        if 'model' in self.env.context and self.env.context.get('model') == 'reports.designer':
            eview = etree.fromstring(res['arch'])
            placeholder = eview.xpath("//group[@name='placeholder1']")
            placeholder2 = eview.xpath("//group[@name='placeholder2']")
            if len(placeholder):
                placeholder2 = placeholder2[0]
            n = 1
            if len(placeholder):
                placeholder = placeholder[0]
                params = self.env['reports.designer.param'].search([('reports_designer_id', '=', self.env.context.get('id'))])            
                if params:
                    for param in params:
                        param_field = self.env['ir.model.fields'].sudo().search([('id', '=', param.wizard_param_ir_model_field_id.id )])
                        if len(param_field):
                            name = param_field['name']
                            name_split = name.split('_')
                            if len(name_split) > 2:
                                if name_split[0] == 'x' and name_split[1] == 'param':
                                    if param_field.ttype == 'many2one':
                                        node = etree.SubElement(placeholder, 'field', {'name': name, 'options':"{'no_open': True, 'no_create': True}", 'can_create': 'false', 'can_write': 'false', 'colspan':"2"}) if ((n % 2) != 0) else \
                                            etree.SubElement(placeholder2, 'field', {'name': name, 'options':"{'no_open': True, 'no_create': True}", 'can_create': 'false', 'can_write': 'false', 'colspan':"2"})
                                    elif param_field.ttype == 'many2many':
                                        node = etree.SubElement(placeholder, 'field', {'name': name, 'widget':"many2many_tags", 'options':"{'no_open': True, 'no_create': True}", 'can_create': 'false', 'can_write': 'false', 'colspan':"2"}) if ((n % 2) != 0) else \
                                            etree.SubElement(placeholder2, 'field', {'name': name, 'widget':"many2many_tags", 'options':"{'no_open': True, 'no_create': True}", 'can_create': 'false', 'can_write': 'false', 'colspan':"2"})
                                    else:
                                        node = etree.SubElement(placeholder, 'field', {'name':name, 'colspan':"2"}) if ((n % 2) != 0) else etree.SubElement(placeholder2, 'field', {'name':name, 'colspan':"2"})
                                    n += 1
            if self.env['reports.designer'].browse(self.env.context.get('id')).send_email:
                node_button_print = eview.xpath(".//button[@name='export_excel']")[0]
                node_footer = node_button_print.getparent()
                node_footer.insert(node_footer.index(node_button_print)+1, etree.SubElement(node_footer, 'button', {'name': 'export_excel',  'string': 'Send by Email',  'type':'object', 'class':'btn-primary', 'context':'{"send_by_email": True}'}))
            try:
                xarch, xfields  = self.env['ir.ui.view'].postprocess_and_fields(eview, self._name)
            except ValueError:
                return res                                    
            res_fields = res['models'][res.get('model')]
            for val in list(xfields[res.get('model')]):
                if val not in res_fields:
                    res_fields += (val,)  
            res['models'] = frozendict({res.get('model'): res_fields,})  
            res['arch'] = etree.tostring(eview, encoding='unicode')
        return res
class CellUtils(object):
    def __init__(self):
        self._COL_STRING_CACHE = {}
        self._STRING_COL_CACHE = {}
        for i in range(1, 18279):
            col = self._get_column_letter(i)
            self._STRING_COL_CACHE[i] = col
            self._COL_STRING_CACHE[col] = i
    def _get_column_letter(self, col_idx):
        if not 1 <= col_idx <= 18278:
            raise ValueError("Invalid column index {0}".format(col_idx))
        letters = []
        while col_idx > 0:
            col_idx, remainder = divmod(col_idx, 26)
            if remainder == 0:
                remainder = 26
                col_idx -= 1
            letters.append(chr(remainder+64))
        return ''.join(reversed(letters))
CellUtil = CellUtils()
