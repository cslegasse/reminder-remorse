import time
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

def get_tasks_completed(user_id):
    tasks = r.smembers(f"{user_id}:reminders")
    tasks_completed = 0
    for task in tasks:
        if r.hget(f"r{task}", "completed"):
            tasks_completed += 1
    return tasks_completed

def get_habit_upkeep(user_id):
    habits = list(filter(
        lambda task: r.hget(f"r{task}", "habit_frequency") > 0,
        r.smembers(f"{user_id}:reminders"
    )))
    habit_upkeep = 0
    for habit in habits:
        if time.time() - int(r.hget(f"r{habit}", "timestamp")) < 86400*int(r.hget(f"r{habit}", "habit_frequency")):
            habit_upkeep += 1
        # if we are past the deadline for this habit, we have failed
    return habit_upkeep

def get_friends_leaderboard(user_id):
    friend_ids = r.smembers(f"{user_id}:friends")
    friend_leaderboard = []
    for friend_id in friend_ids:
        friend_leaderboard.append({
            "id": friend_id,
            "fname": r.hget(f"u{friend_id}", "fname"),
            "lname": r.hget(f"u{friend_id}", "lname"),
            "tasks_completed": get_tasks_completed(friend_id)
        })
    return friend_leaderboard

def get_metrics(user_id):
    return {
        "tasks_completed": get_tasks_completed(user_id),
        "habits_kept": get_habit_upkeep(user_id)
    }