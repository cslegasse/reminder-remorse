import time
import random
from services import redis_service, transaction
r = redis_service.redis_manager.redis

def create_reminder(reminder_data):
    reminder_id = int(r.get("reminder_id"))
    if 'org_id' in reminder_data:
        r.hset(f"r{reminder_id}", 'org_id', int(reminder_data['org_id']))
    elif 'friend_id' in reminder_data:
        r.hset(f"r{reminder_id}", 'friend_id', int(reminder_data['friend_id']))
    else:
        raise ValueError("Reminder must have either org_id or friend_id")
    r.incr("reminder_id")
    reminder_data['id'] = reminder_id
    print(reminder_data)
    owner_id = reminder_data['owner_id']
    r.sadd(f"{owner_id}:reminders", reminder_id)
    r.hset(f"r{reminder_id}", 'name', reminder_data['name'])
    r.hset(f"r{reminder_id}", 'desc', reminder_data['desc'] if 'desc' in reminder_data else '')
    try:
        emoji = chr(int('0x'+reminder_data['emoji'], 16))
    except ValueError:
        try:
            emoji = reminder_data['emoji']
        except KeyError:
            emoji = ''
    print("emoji: " + emoji)
    r.hset(f"r{reminder_id}", 'emoji', emoji)
    r.hset(f"r{reminder_id}", 'owner_id', reminder_data['owner_id'])
    r.hset(f"r{reminder_id}", 'category', reminder_data['category'] if 'category' in reminder_data else '')
    r.hset(f"r{reminder_id}", 'created_at', int(time.time()))
    r.hset(f"r{reminder_id}", 'completed_at', -1)
    r.hset(f"r{reminder_id}", 'deadline', reminder_data['deadline'])
    r.hset(f"r{reminder_id}", 'completed', int(False))
    r.hset(f"r{reminder_id}", 'pinned', int(False))
    r.hset(f"r{reminder_id}", 'habit_frequency', reminder_data['habit_frequency'] if 'habit_frequency' in reminder_data else 0)
    r.hset(f"r{reminder_id}", 'incentive_min', float(reminder_data['incentive_min']))
    r.hset(f"r{reminder_id}", 'incentive_max', float(reminder_data['incentive_max']))

    return {"id": reminder_id}

def delete_reminder(reminder_id):
    user_id = r.hget(f'r{reminder_id}', "user_id")
    r.srem(f"{user_id}:reminders", reminder_id)
    r.delete(reminder_id)

def get_reminder(reminder_id):
    reminder_id = int(reminder_id)
    reminder_data = {}
    for key in map(lambda k: k.decode('utf-8'), r.hkeys(f"r{reminder_id}")):
        reminder_data[key] = r.hget(f"r{reminder_id}", key).decode('utf-8')
    for key in ['owner_id', 'deadline', 'created_at', 'completed_at', 'habit_frequency']:
        reminder_data[key] = int(reminder_data[key])
    for key in ['pinned', 'completed']:
        reminder_data[key] = bool(int(reminder_data[key]))
    for key in ['incentive_min', 'incentive_max']:
        reminder_data[key] = float(reminder_data[key])
    reminder_data['id'] = reminder_id
    return reminder_data

def get_reminders(user_id):
    return list(map(get_reminder, r.smembers(f"{int(user_id)}:reminders")))

def update_reminder(reminder_id, reminder_data):
    for key in reminder_data:
        r.hset(f"r{reminder_id}", key, reminder_data[key])

def check_reminder(reminder_id):
    freq = int(r.hget(f'r{reminder_id}', "habit_frequency"))
    if freq > 0:
        old_time = int(r.hget(reminder_id, "deadline"))
        r.hset(f'r{reminder_id}', "deadline", old_time + freq*86400)
    else:
        r.hset(f'r{reminder_id}', "completed", int(True))
        r.hset(f'r{reminder_id}', "completed_at", int(time.time()))

def fail_reminder(reminder_id):
    owner_id = int(r.hget(reminder_id, "owner_id"))
    org_id = r.hget(reminder_id, "org_id")
    friend_id = r.hget(reminder_id, "friend_id")
    if org_id is not None:
        org_id = int(org_id)
    elif friend_id is not None:
        friend_id = int(friend_id)
    else:
        raise ValueError("Reminder must have either org_id or friend_id")
    r.hset(f"r{reminder_id}", "completed", int(False))
    i_min = float(r.hget(f"r{reminder_id}", "incentive_min"))
    i_max = float(r.hget(f"r{reminder_id}", "incentive_max"))
    amt = int(random.uniform(i_min, i_max)*100)/100.0
    if org_id is not None:
        transaction.create_transaction({
            "user_id": owner_id,
            "org_id": org_id,
            "amt": amt
        })
    elif friend_id is not None:
        transaction.create_transaction({
            "user_id": owner_id,
            "friend_id": friend_id,
            "amt": amt
        })
    freq = int(r.hget(reminder_id, "habit_frequency"))
    if freq > 0:
        old_time = int(r.hget(f'r{reminder_id}', "deadline"))
        r.hset(f'r{reminder_id}', "deadline", old_time + freq*86400)