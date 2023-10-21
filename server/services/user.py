import time
from services import redis_service
r = redis_service.redis_manager.redis

def create_user(user_data):
    user_id = int(r.get("user_id"))
    r.incr("user_id")
    r.hset(f"u{user_id}", 'fname', user_data['fname'])
    r.hset(f"u{user_id}", 'lname', user_data['lname'])
    r.hset(f"u{user_id}", 'clerk_id', user_data['clerk_id'])
    r.hset(f"u{user_id}", 'clerk_json', user_data['clerk_json'])
    r.hset(f"u{user_id}", 'created_at', user_data['created_at'])
    r.hset(f"u{user_id}", 'last_login', user_data['last_login'])
    # also included: empty sets for reminders and friends
    return {"id": user_id}

def delete_user(user_id):
    r.delete(user_id)
    r.delete(f"{user_id}:reminders")
    r.delete(f"{user_id}:friends")

def get_user(user_id):
    user_data = {}
    for key in r.hkeys(f"u{user_id}"):
        user_data[key] = str(r.hget(f"u{user_id}", key))
    user_data['reminders'] = list(map(int, r.smembers(f"{user_id}:reminders")))
    user_data['friends'] = list(map(int, r.smembers(f"{user_id}:friends")))
    return user_data

def add_friend(user_id, friend_id):
    r.sadd(f"{user_id}:friends", friend_id)

def get_reminders(user_id):
    return r.smembers(f"{user_id}:reminders")

def get_friends(user_id):
    friends = []
    for friend_id in r.smembers(f"{user_id}:friends"):
        print(f"friend: {friend_id}, {get_user(friend_id)}")
        friends.append(get_user(friend_id))
    print(f"friends: {friends}")
    return friends

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
    habits = map(int, filter(
        lambda task: int(r.hget(f"r{int(task)}", "habit_frequency")) > 0,
        r.smembers(f"{user_id}:reminders")
    ))
    print(f"HABITS: {habits}")
    habit_upkeep = 0
    for habit in habits:
        if time.time() - int(r.hget(f"r{habit}", "timestamp")) < 86400*int(r.hget(f"r{habit}", "habit_frequency")):
            habit_upkeep += 1
        # if we are past the deadline for this habit, we have failed
    return habit_upkeep

def get_friends_leaderboard(user_id):
    friend_ids = map(int, r.smembers(f"{user_id}:friends"))
    friend_leaderboard = []
    for friend_id in friend_ids:
        friend_leaderboard.append({
            "id": int(friend_id),
            "fname": r.hget(f"u{friend_id}", "fname").decode('utf-8'),
            "lname": r.hget(f"u{friend_id}", "lname").decode('utf-8'),
            "taskCompleted": get_tasks_completed(friend_id),
            "habitsKept": get_habit_upkeep(friend_id)
        })
    print(friend_leaderboard)
    return friend_leaderboard

def get_metrics(user_id):
    return {
        "tasks_completed": get_tasks_completed(user_id),
        "habits_kept": get_habit_upkeep(user_id)
    }