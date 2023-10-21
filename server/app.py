from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from services import user, reminder, seed
from services.redis_service import redis_manager

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

r = redis_manager.redis
r.flushdb()
r.set("user_id", 0)
r.set("reminder_id", 0)
r.set("transaction_id", 0)
seed.seed_db()

@app.route('/')
def index():
    return jsonify({"message": "Hello, World!"})

@app.route('/test')
def test():
    name = request.args.get("name")
    return jsonify({"message": f"Hello, {name}!"})

@app.route('/create-user')
def create_user():
    user_data = request.form.to_dict()
    return user.create_user(user_data)

@app.route('/get-user')
def get_user():
    user_id = request.args.get("id")
    return user.get_user(user_id)

@app.route('/create-reminder')
def create_reminder():
    reminder_data = request.form.to_dict()
    return reminder.create_reminder(reminder_data)

@app.route('/delete-reminder')
def delete_reminder():
    reminder_id = request.args.get("id")
    return reminder.delete_reminder(reminder_id)

@app.route('/get-reminder')
def get_reminder():
    reminder_id = request.args.get("id")
    return reminder.get_reminder(reminder_id)

@app.route('/api/leaderboard')
def leaderboard():
    user_id = request.args.get("id")
    return jsonify(user.get_friends_leaderboard(user_id))

@app.route('/api/friends')
def friends():
    user_id = request.args.get("id")
    print("getting friends")
    res = jsonify(user.get_friends(user_id))
    print(res)
    print(user.get_friends(user_id))
    return res

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port='8000')