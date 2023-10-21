from services import redis_service
r = redis_service.redis_manager.redis

def create_user(user_data):
    user_id = int(r.get("user_id"))
    r.incr("user_id")
    user_data['id'] = user_id
    for key in user_data:
        r.hset(f"u{user_id}", key, user_data[key])
    return {"id": user_id}

def delete_user(user_id):
    r.delete(user_id)
    r.delete(f"{user_id}:reminders")
    r.delete(f"{user_id}:friends")

def get_user(user_id):
    user_data = {}
    for key in r.hkeys(f"u{user_id}"):
        user_data[key] = r.hget(f"u{user_id}", key)
    user_data['reminders'] = r.smembers(f"{user_id}:reminders")
    user_data['friends'] = r.smembers(f"{user_id}:friends")
    return user_data