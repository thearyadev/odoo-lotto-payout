# -*- coding: utf-8 -*-
{
    'name': 'Lotto Payout',
    'version': '1.0',
    'summary': 'Adds a Lotto Payout button to POS',
    'description': 'Module that adds a button to POS for processing lotto payouts.',
    'category': 'Tools',
    'author': 'Custom',
    'depends': ['point_of_sale'],
    'data': [],
    'assets': {
        'point_of_sale._assets_pos': [
            'odoo-lotto-payout/static/src/js/console_button.js',
            'odoo-lotto-payout/static/src/xml/console_button.xml',
        ],
    },
    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}
