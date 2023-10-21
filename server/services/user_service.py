from services import redis_service
r = redis_service.redis_manager.redis

def create_user(user_data):
    user_id = int(r.get("user_id"))
    r.incr("user_id")
    user_data['id'] = user_id
    return {"id": user_id}

def delete_user(user_id):
    r.delete(user_id)
    r.delete(f"{user_id}:reminders")
    r.delete(f"{user_id}:friends")