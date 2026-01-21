# -*- coding: utf-8 -*-
{
    'name': 'Console Log Button',
    'version': '1.0',
    'summary': 'Adds a button that logs to browser console',
    'description': 'Simple module that adds a button to the systray that logs a message to the browser console.',
    'category': 'Tools',
    'author': 'Custom',
    'depends': ['point_of_sale'],
    'data': [],
    'assets': {
        'point_of_sale._assets_pos': [
            'console_log_button/static/src/js/console_button.js',
            'console_log_button/static/src/xml/console_button.xml',
        ],
    },
    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}
