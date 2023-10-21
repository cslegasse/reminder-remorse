from flask import Flask, jsonify, request
from services import user, reminder
from services.redis_service import redis_manager

app = Flask(__name__)

r = redis_manager.redis
r.flushdb()
r.set("user_id", 0)
r.set("reminder_id", 0)
r.set("transaction_id", 0)

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

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port='8000')