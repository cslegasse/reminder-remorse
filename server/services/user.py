import time
from services import reminder, redis_service
r = redis_service.redis_manager.redis

def create_user(user_data):
    user_id = int(r.get("user_id"))
    r.incr("user_id")
    user_data['created_at'] = int(user_data['created_at'])
    user_data['last_login'] = int(user_data['last_login'])
    r.hmset(f"u{user_id}", user_data)
    # r.hset(f"u{user_id}", 'username', user_data['username'])
    # r.hset(f"u{user_id}", 'fname', user_data['fname'])
    # r.hset(f"u{user_id}", 'lname', user_data['lname'])
    # r.hset(f"u{user_id}", 'clerk_id', user_data['clerk_id'])
    # r.hset(f"u{user_id}", 'clerk_json', user_data['clerk_json'])
    # r.hset(f"u{user_id}", 'created_at', int(user_data['created_at']))
    # r.hset(f"u{user_id}", 'last_login', int(user_data['last_login']))
    # also included: empty sets for reminders and friends
    return {"id": user_id}

def delete_user(user_id):
    r.delete(f'u{user_id}')
    r.delete(f"{user_id}:reminders")
    r.delete(f"{user_id}:friends")

def get_user(user_id):
    user_data = {}
    for key in map(lambda k: k.decode('utf-8'), r.hscan(f"u{user_id}")[1]):
        user_data[key] = r.hget(f"u{user_id}", key).decode('utf-8')
    for key in ['created_at', 'last_login']:
        user_data[key] = int(user_data[key])
    user_data['reminders'] = list(map(int, r.smembers(f"{user_id}:reminders")))
    user_data['friends'] = list(map(int, r.smembers(f"{user_id}:friends")))
    user_data['id'] = user_id
    return user_data

def get_user_by_username(username):
    for i in range(int(r.get("user_id"))):
        if r.hget(f"u{i}", "username") is not None and r.hget(f"u{i}", "username").decode('utf-8') == username:
            return get_user(i)
    return None

def user_by_clerk_id(clerk_id):
    for i in range(int(r.get("user_id"))):
        if r.hget(f"u{i}", "clerk_id") is not None and r.hget(f"u{i}", "clerk_id").decode('utf-8') == clerk_id:
            return get_user(i)
    return None

def add_friend(user_id, friend_username):
    friend_id = get_user_by_username(friend_username)['id']
    # print("adding friend " + str(friend_id))
    r.sadd(f"{user_id}:friends", friend_id)
    r.sadd(f"{friend_id}:friends", user_id)
    return 0
def remove_friend(user_id, friend_id):
    # print("removing friend " + str(friend_id))
    r.srem(f"{user_id}:friends", friend_id)
    r.srem(f"{friend_id}:friends", user_id)
    return 0

def get_friends(user_id):
    friends = []
    for friend_id in r.smembers(f"{user_id}:friends"):
        friend = get_user(int(friend_id))
        friend['id'] = int(friend_id)
        # print(f"friend: {friend_id}, {friend}")
        friends.append(friend)
    # print(f"friends: {friends}")
    return friends

def get_tasks_completed(user_id):
    tasks = map(int, r.smembers(f"{user_id}:reminders"))
    tasks_completed = 0
    for task in tasks:
        completed = bool(int(r.hget(f"r{task}", "completed").decode('utf-8')))
        if completed:
            tasks_completed += 1
    return tasks_completed

def get_habit_upkeep(user_id):
    habits = map(int, filter(
        lambda task: int(r.hget(f"r{int(task)}", "habit_frequency")) > 0,
        r.smembers(f"{user_id}:reminders")
    ))
    habit_upkeep = 0
    for habit in habits:
        if int(time.time()) < int(r.hget(f"r{habit}", "deadline")):
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
    
    return friend_leaderboard

def get_metrics(user_id):
    completion = []
    habits = []
    for task in reminder.get_reminders(user_id):
        if task['completed']:
            completion.append(task['completed_at'])
        if task['habit_frequency'] > 0:
            habits.append({
                'from': task['created_at'],
                'to': task['deadline']
            })
    startDate = int(r.hget(f"u{user_id}", "created_at"))
    
    return {
        "tasksCompleted": get_tasks_completed(user_id),
        "habitsKept": get_habit_upkeep(user_id),
        "completion": completion,
        "habits": habits,
        "startDate": startDate
    }