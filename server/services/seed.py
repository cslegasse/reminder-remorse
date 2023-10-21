from services import user, reminder, transaction

def seed_db():
    user.create_user({
        'fname': 'John',
        'lname': 'Doe',
        'clerk_id': '6723647823',
        'clerk_json': '{{}}',
        'created_at': 1697763036,
        'last_login': 1697893036
    })
    assert user.create_user({
        'fname': 'Jane',
        'lname': 'Doe',
        'clerk_id': '6723647824',
        'clerk_json': '{{}}',
        'created_at': 1697773036,
        'last_login': 1697893046
    })['id'] == 1

    user.add_friend(0, 1)
    user.add_friend(1, 0)

    print(user.get_user(0))

    reminder.create_reminder({
        'name': 'Finish TensorFlow tutorial',
        'desc': '',
        'emoji': '👩‍💻',
        'category': 'Work',
        'owner_id': 1,
        'timestamp': 1697983666,
        'completed': True,
        'pinned': False,
        'bump': 0,
        'habit_frequency': 0
    })

    assert reminder.create_reminder({
        'name': 'Finish TensorFlow tutorial',
        'desc': '',
        'emoji': '👨‍💻',
        'category': 'Work',
        'owner_id': 0,
        'timestamp': 1697806983,
        'completed': False,
        'pinned': False,
        'bump': 1,
        'habit_frequency': 0
    })['id'] == 1

    assert reminder.create_reminder({
        'name': 'Go to the gym',
        'desc': 'Get fit!',
        'emoji': '🏋️',
        'category': 'Health/Fitness',
        'owner_id': 0,
        'timestamp': 1697808031,
        'completed': False,
        'pinned': False,
        'bump': 1,
        'habit_frequency': 2
    })['id'] == 2

    assert reminder.create_reminder({
        'name': 'Go to the gym',
        'desc': 'Get fit!',
        'emoji': '🏋️',
        'category': 'Health/Fitness',
        'owner_id': 1,
        'timestamp': 1697808031,
        'completed': False,
        'pinned': False,
        'bump': 0,
        'habit_frequency': 2
    })['id'] == 3

    assert reminder.create_reminder({
        'name': 'Study the history of astronomy',
        'desc': 'Ask librarian for good books',
        'emoji': '🔭',
        'category': 'Education',
        'owner_id': 0,
        'timestamp': 1697462602,
        'completed': False,
        'pinned': False,
        'bump': -1,
        'habit_frequency': 7
    })['id'] == 4