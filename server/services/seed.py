import random
from services import user, reminder, transaction

def seed_db():
    user.create_user({
        'fname': 'John',
        'lname': 'Doe',
        'clerk_id': '6723647823',
        'clerk_json': '{{}}',
        'created_at': 1684169994,
        'last_login': 1697893036
    })
    assert user.create_user({
        'fname': 'Jane',
        'lname': 'Doe',
        'clerk_id': '6723647824',
        'clerk_json': '{{}}',
        'created_at': 1684169994,
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
    reminder.update_reminder(1, {
        'created_at': 1697963666
    })
    reminder.check_reminder(0)

    assert reminder.create_reminder({
        'name': 'Finish TensorFlow tutorial',
        'desc': 'AI grind',
        'emoji': '👨‍💻',
        'category': 'Work',
        'owner_id': 0,
        'deadline': 1697806983+4*86400,
        'pinned': False,
        'habit_frequency': 0,
        'incentive_min': 2,
        'incentive_max': 5.7,
        'friend_id': 1
    })['id'] == 1
    reminder.update_reminder(1, {
        'created_at': 1697406983
    })

    assert reminder.create_reminder({
        'name': 'Go to the gym',
        'desc': 'Get fit!',
        'emoji': '🏋️',
        'category': 'Health/Fitness',
        'owner_id': 0,
        'deadline': 1697808031+3*86400,
        'pinned': False,
        'habit_frequency': 2,
        'incentive_min': 2,
        'incentive_max': 5.7,
        'friend_id': 1
    })['id'] == 2
    reminder.update_reminder(2, {
        'created_at': 1684169994
    })

    assert reminder.create_reminder({
        'name': 'Go to the gym',
        'desc': 'Get fit!',
        'emoji': '🏋️',
        'category': 'Health/Fitness',
        'owner_id': 1,
        'deadline': 1697808031,
        'pinned': False,
        'habit_frequency': 2,
        'incentive_min': 2,
        'incentive_max': 5.7,
        'friend_id': 0
    })['id'] == 3
    reminder.update_reminder(3, {
        'created_at': 1684169994
    })

    assert reminder.create_reminder({
        'name': 'Study the history of astronomy',
        'desc': 'Ask librarian for good books',
        'emoji': '🔭',
        'category': 'Education',
        'owner_id': 0,
        'deadline': 1697462602,
        'pinned': False,
        'habit_frequency': 7,
        'incentive_min': 0,
        'incentive_max': 0,
        'org_id': 2
    })['id'] == 4
    reminder.update_reminder(4, {
        'created_at': 1695302602
    })

    for i in range(10):
        task_type = random.randint(0, 4)
        names = ['Take out the trash', 'Do laundry', 'Wash dishes', 'Water plants', 'Read a chapter of a book']
        emojis = ['🗑️', '🧺', '🍽️', '🪴', '📚']
        reminder.create_reminder({
            'name': names[task_type],
            'desc': '',
            'emoji': emojis[task_type],
            'category': 'Home',
            'owner_id': 0,
            'deadline': 1695302602 + 86400 - i*86400*10,
            'pinned': False,
            'habit_frequency': 0,
            'incentive_min': 0.1,
            'incentive_max': 0.8,
            'org_id': 2
        })
        # reminder.check_reminder(i+5)
        reminder.update_reminder(i+5, {
            'created_at': 1695302602 - i*86400*10
        })
        if random.random() > 0.1:
            reminder.update_reminder(i+5, {
                'completed_at': 1695302602 + 86400*10 - i*86400*10 - 3600,
                'completed': int(True)
            })
    
    assert reminder.create_reminder({
        'name': 'Go to HackHarvard',
        'desc': '',
        'emoji': '👨‍💻',
        'category': 'Work',
        'owner_id': 0,
        'deadline': 1697832000,
        'pinned': False,
        'habit_frequency': 0,
        'incentive_min': 1,
        'incentive_max': 3,
        'org_id': 0
    })['id'] == 15
    reminder.check_reminder(15)
    reminder.update_reminder(15, {
        'created_at': 1697808031 - 86400,
        'completed_at': 1697831000
    })

    reminder.create_reminder({
        'name': 'Win HackHarvard',
        'desc': 'In it to win it!',
        'emoji': '💻',
        'category': 'Work',
        'owner_id': 0,
        'deadline': 1697976000,
        'pinned': True,
        'habit_frequency': 0,
        'incentive_min': 2,
        'incentive_max': 5.7,
        'friend_id': 1
    })['id'] == 1
    reminder.update_reminder(1, {
        'created_at': 1697406983
    })
    
    print(user.get_user(0))