from services import redis_service
r = redis_service.redis_manager.redis

def create_user(user_data):
    user_id = int(r.get("user_id"))
    r.incr("user_id")
    user_data['id'] = user_id
    r.hset(f"u{user_id}", 'fname', user_id['fname'])
    r.hset(f"u{user_id}", 'lname', user_id['lname'])
    r.hset(f"u{user_id}", 'clerk_id', user_id['clerk_id'])
    r.hset(f"u{user_id}", 'clerk_json', user_id['clerk_json'])
    r.hset(f"u{user_id}", 'created_at', user_id['created_at'])
    r.hset(f"u{user_id}", 'last_login', user_id['last_login'])
    # also included: empty sets for reminders and friends
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

def get_reminders(user_id):
    return r.smembers(f"{user_id}:reminders")

def get_friends(user_id):
    return r.smembers(f"{user_id}:friends")

def get_friends_reminders(user_id):
    # get all friends reminders that the current user can bump
    friend_ids = r.smembers(f"{user_id}:friends")
    friend_reminders = []
    for friend_id in friend_ids:
        for reminder_id in r.smembers(f"{friend_id}:reminders"):
            if r.hget(f"r{reminder_id}", "bump") == user_id:
                friend_reminders.append(reminder_id)
    return set(friend_reminders)