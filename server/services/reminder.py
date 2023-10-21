import random
from services import redis_service, transaction
r = redis_service.redis_manager.redis

def create_reminder(reminder_data):
    reminder_id = int(r.get("reminder_id"))
    r.incr("reminder_id")
    reminder_data['id'] = reminder_id
    user_id = reminder_data['user_id']
    r.sadd(f"{user_id}:reminders", reminder_id)
    r.hset(f"r{reminder_id}", 'name', reminder_data['name'])
    r.hset(f"r{reminder_id}", 'desc', reminder_data['desc'])
    r.hset(f"r{reminder_id}", 'emoji', reminder_data['emoji'])
    r.hset(f"r{reminder_id}", 'owner_id', reminder_data['owner_id'])
    r.hset(f"r{reminder_id}", 'category', reminder_data['category'])
    r.hset(f"r{reminder_id}", 'timestamp', reminder_data['timestamp'])
    r.hset(f"r{reminder_id}", 'completed', reminder_data['completed'])
    r.hset(f"r{reminder_id}", 'pinned', reminder_data['pinned'])
    r.hset(f"r{reminder_id}", 'bump', reminder_data['bump']) # the friend id who can bump the reminder, optional
    r.hset(f"r{reminder_id}", 'habit_frequency', reminder_data['habit_frequency'])
    return {"id": reminder_id}

def delete_reminder(reminder_id):
    user_id = r.hget(reminder_id, "user_id")
    r.srem(f"{user_id}:reminders", reminder_id)
    r.delete(reminder_id)

def get_reminder(reminder_id):
    reminder_data = {}
    for key in r.hkeys(f"r{reminder_id}"):
        reminder_data[key] = r.hget(f"r{reminder_id}", key)
    return reminder_data

def update_reminder(reminder_id, reminder_data):
    for key in reminder_data:
        r.hset(f"r{reminder_id}", key, reminder_data[key])

def check_reminder(reminder_id):
    freq = int(r.hget(reminder_id, "habit_frequency"))
    if freq > 0:
        old_time = int(r.hget(reminder_id, "timestamp"))
        r.hset(reminder_id, "timestamp", old_time + freq*86400)
    else:
        r.hset(reminder_id, "completed", True)

def fail_reminder(reminder_id, org_id=None):
    r.hset(f"r{reminder_id}", "completed", False)
    bump = r.hget(f"r{reminder_id}", "bump")
    amt = random.randint(1, 10)
    if org_id is not None:
        transaction.create_transaction({
            "org_id": org_id,
            "amt": amt
        })
    elif bump != -1:
        transaction.create_transaction({
            "user_id": bump,
            "amt": amt
        })
    freq = int(r.hget(reminder_id, "habit_frequency"))
    if freq > 0:
        old_time = int(r.hget(reminder_id, "timestamp"))
        r.hset(reminder_id, "timestamp", old_time - freq*86400)