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
        'name': 'finish TensorFlow tutorial',
        'desc': '',
        'emoji': '👩‍💻',
        'category': 'Work',
        'owner_id': 1,
        'created_at': 1697963666,
        'deadline': 1697983666,
        'pinned': False,
        'habit_frequency': 0,
        'incentive_min': 0,
        'incentive_max': 3.2,
        'friend_id': 0
    })
    reminder.check_reminder(0)

    assert reminder.create_reminder({
        'name': 'Finish TensorFlow tutorial',
        'desc': 'AI grind',
        'emoji': '👨‍💻',
        'category': 'Work',
        'owner_id': 0,
        'created_at': 1697406983,
        'deadline': 1697806983,
        'pinned': False,
        'habit_frequency': 0,
        'incentive_min': 2,
        'incentive_max': 5.7,
        'friend_id': 1
    })['id'] == 1

    assert reminder.create_reminder({
        'name': 'Go to the gym',
        'desc': 'Get fit!',
        'emoji': '🏋️',
        'category': 'Health/Fitness',
        'owner_id': 0,
        'created_at': 1666272031,
        'deadline': 1697808031,
        'pinned': False,
        'habit_frequency': 2,
        'incentive_min': 2,
        'incentive_max': 5.7,
        'friend_id': 1
    })['id'] == 2

    assert reminder.create_reminder({
        'name': 'Go to the gym',
        'desc': 'Get fit!',
        'emoji': '🏋️',
        'category': 'Health/Fitness',
        'owner_id': 1,
        'created_at': 1666272035,
        'deadline': 1697808031,
        'pinned': False,
        'habit_frequency': 2,
        'incentive_min': 2,
        'incentive_max': 5.7,
        'friend_id': 0
    })['id'] == 3

    assert reminder.create_reminder({
        'name': 'Study the history of astronomy',
        'desc': 'Ask librarian for good books',
        'emoji': '🔭',
        'category': 'Education',
        'owner_id': 0,
        'created_at': 1695302602,
        'deadline': 1697462602,
        'pinned': False,
        'habit_frequency': 7,
        'incentive_min': 0,
        'incentive_max': 0,
        'org_id': 2
    })['id'] == 4