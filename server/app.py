from flask import Flask, jsonify, request
from flask_cors import CORS

from config import settings
from services import user, reminder, redis_service, charity, seed, transaction, clerk


app = Flask(__name__)
cors = CORS(app)
app.config.from_object(settings)


@app.route("/")
def index():
    return jsonify({"message": "Hello, World!"})


@app.route("/api/test")
def test():
    name = request.args.get("name")
    return jsonify({"message": f"Hello, {name}!"})


@app.route("/api/create-user")
def create_user():
    user_data = request.form.to_dict()
    return user.create_user(user_data)


@app.route("/api/get-user")
def get_user():
    user_id = int(request.args.get("id"))
    return user.get_user(user_id)


@app.route("/api/sync-user", methods=["POST"])
def sync_user():
    headers = dict(request.headers)
    payload = request.get_data()
    try:
        clerk.sync_user(headers, payload)
    except Exception as e:
        return jsonify({"message": e})
    return "User data synced", 204


@app.route("/api/user-by-clerk")
def get_user_by_clerk():
    clerk_id = request.args.get("id")
    return user.user_by_clerk_id(clerk_id)


@app.route("/api/create-reminder", methods=["POST"])
def create_reminder():
    reminder_data = request.json
    return jsonify(reminder.create_reminder(reminder_data))


@app.route("/api/delete-reminder")
def delete_reminder():
    reminder_id = int(request.args.get("id"))
    return reminder.delete_reminder(reminder_id)


@app.route("/api/get-reminder")
def get_reminder():
    reminder_id = int(request.args.get("id"))
    return reminder.get_reminder(reminder_id)


@app.route("/api/leaderboard")
def leaderboard():
    user_id = int(request.args.get("id"))
    return jsonify(user.get_friends_leaderboard(user_id))


@app.route("/api/friends")
def friends():
    user_id = int(request.args.get("id"))
    return jsonify(user.get_friends(user_id))


@app.route("/api/add-friend")
def add_friend():
    user_id = int(request.args.get("id"))
    friend_username = request.args.get("friend_username")
    return jsonify(user.add_friend(user_id, friend_username))


@app.route("/api/remove-friend")
def remove_friend():
    user_id = int(request.args.get("id"))
    friend_id = int(request.args.get("friend_id"))
    return jsonify(user.remove_friend(user_id, friend_id))


@app.route("/api/reminders")
def reminders():
    user_id = request.args.get("id")
    return jsonify(reminder.get_reminders(user_id))


@app.route("/api/metrics")
def metrics():
    user_id = request.args.get("id")
    return jsonify(user.get_metrics(user_id))


@app.route("/api/charity")
def get_charity():
    user_id = int(request.args.get("id"))
    return jsonify(charity.get_charity(user_id))


@app.route("/api/charities")
def charities():
    return jsonify(charity.get_charities())


@app.route("/api/check-reminder")
def check_reminder():
    reminder_id = int(request.args.get("id"))
    return jsonify(reminder.check_reminder(reminder_id))


@app.route("/api/overdue-reminders")
def overdue_reminders():
    user_id = int(request.args.get("id"))
    return jsonify(reminder.check_reminder_overdue(user_id))


@app.route("/api/transactions")
def transactions():
    print("hi")
    user_id = int(request.args.get("id"))
    return jsonify(transaction.get_transactions(user_id))


if __name__ == "__main__":
    r = redis_service.redis_manager.redis
    r.flushdb()
    r.set("user_id", 0)
    r.set("reminder_id", 0)
    r.set("transaction_id", 0)
    seed.seed_db()

    app.run(debug=True, host="localhost", port="8000")
