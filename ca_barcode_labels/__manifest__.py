{
    'name': 'Print Dynamic Product Barcode Labels For Product, Template, Sales Order, Purchase Order, Picking',
    'version': '15.0.1',
    'category': 'Other',
    'author': 'CustomizeApps',
    'summary': 'Print Dynamic Product Barcode Labels Template Purchase Order Picking Print Dynamic Barcode Labels Dynamic Product Labels dynamic label Odoo Barcode Labels Dynamic Product Label Print Dynamic Barcode Product Label Print dynamic label dynamic product label Barcode Label product barcode label dynamic product barcode dynamic barcode',
    'description': '''Print Dynamic Product Barcode Labels Template Purchase Order Picking Print Dynamic Barcode Labels Dynamic Product Labels dynamic label Odoo Barcode Labels Dynamic Product Label Print
Dynamic Barcode Product Label Print dynamic label dynamic product label Barcode Label product barcode label dynamic product barcode dynamic barcode''',
    'depends': ['stock', 'web', 'purchase', 'sale_management'],
    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'views/report_product_label.xml',
        'views/barcode_labels.xml',
        'views/barcode_configuration_view.xml',
        'data/ca_barcode_labels_data.xml',
    ],
    'images': ['static/description/ca_barcode_labels_banner.gif'],
    'currency': 'USD',
    'price': 9.99,
    'license': 'OPL-1',
    'installable': True,
}