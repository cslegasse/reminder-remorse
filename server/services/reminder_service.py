from services import redis_service
r = redis_service.redis_manager.redis

def create_reminder(reminder_data):
    reminder_id = int(r.get("reminder_id"))
    r.incr("reminder_id")
    reminder_data['id'] = reminder_id
    user_id = reminder_data['user_id']
    r.sadd(f"{user_id}:reminders", reminder_id)
    for key in reminder_data:
        r.hset(f"r{reminder_id}", key, reminder_data[key])
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