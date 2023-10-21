from flask import Flask, jsonify, request
from services import user_service
from services.redis_service import redis_manager

app = Flask(__name__)

r = redis_manager.redis
r.flushdb()
r.set("user_id", 0)

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
    return user_service.create_user(user_data)

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port='8000')