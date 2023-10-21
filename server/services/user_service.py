import redis
from redis_service import redis_manager

def create_user(user_data):
    r = redis_manager.redis
    user_id = int(r.get("user_id"))
    r.incr("user_id")
    user_data['uid'] = user_id
    return user_id