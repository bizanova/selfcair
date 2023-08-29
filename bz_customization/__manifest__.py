# -*- coding: utf-8 -*-
{
    "name": "Bizanova Customization",
    "summary": """
        Customization.
    """,
    "description": """
        Long description of module's purpose
    """,
    "author": "Bizanova",
    "website": "",
    "category": "Uncategorized",
    "version": "15.0.1.0",
    # any module necessary for this one to work correctly
    "depends": [
        "stock",
        "delivery",
    ],
    # always loaded
    "data": [
        'views/stock_picking_report_view.xml',
        'views/stock_picking_view.xml',
        'views/report_picking.xml'
    ],
    'installable': True,
    'application': True,
}
