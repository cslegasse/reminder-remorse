from flask import Flask, jsonify, request
from flask_cors import CORS
from services import user, reminder, charity, seed
from services.redis_service import redis_manager

app = Flask(__name__)
cors = CORS(app)

r = redis_manager.redis
r.flushdb()
r.set("user_id", 0)
r.set("reminder_id", 0)
r.set("transaction_id", 0)
seed.seed_db()

@app.route('/')
def index():
    return jsonify({"message": "Hello, World!"})

@app.route('/api/test')
def test():
    name = request.args.get("name")
    return jsonify({"message": f"Hello, {name}!"})

@app.route('/api/create-user')
def create_user():
    user_data = request.form.to_dict()
    return user.create_user(user_data)

@app.route('/api/get-user')
def get_user():
    user_id = int(request.args.get("id"))
    return user.get_user(user_id)

@app.route('/api/user-by-clerk')
def get_user_by_clerk():
    clerk_id = request.args.get("id")
    return user.user_by_clerk_id(clerk_id)

@app.route('/api/create-reminder', methods=['POST'])
def create_reminder():
    reminder_data = request.json
    return jsonify(reminder.create_reminder(reminder_data))

@app.route('/api/delete-reminder')
def delete_reminder():
    reminder_id = int(request.args.get("id"))
    return reminder.delete_reminder(reminder_id)

@app.route('/api/get-reminder')
def get_reminder():
    reminder_id = int(request.args.get("id"))
    return reminder.get_reminder(reminder_id)

@app.route('/api/leaderboard')
def leaderboard():
    user_id = int(request.args.get("id"))
    return jsonify(user.get_friends_leaderboard(user_id))

@app.route('/api/friends')
def friends():
    user_id = int(request.args.get("id"))
    return jsonify(user.get_friends(user_id))

@app.route('/api/reminders')
def reminders():
    user_id = request.args.get("id")
    return jsonify(reminder.get_reminders(user_id))

@app.route('/api/metrics')
def metrics():
    user_id = request.args.get("id")
    return jsonify(user.get_metrics(user_id))

@app.route('/api/charities')
def charities():
    return jsonify(charity.get_charities())

@app.route('/api/overdue-reminders')
def overdue_reminders():
    user_id = int(request.args.get("id"))
    return jsonify(reminder.check_reminder_overdue(user_id))

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port='8000')