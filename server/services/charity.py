def get_charities():
    return [
        {'id': 0, 'name': 'The Red Cross'},
        {'id': 1, 'name': 'GiveWell'},
        {'id': 2, 'name': 'Doctors Without Borders'},
        {'id': 3, 'name': 'Save the Children'},
    ]

def get_charity(charity_id):
    for c in get_charities():
        if c['id'] == charity_id:
            return c
    return None