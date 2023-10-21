from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify({"message": "Hello, World!"})

@app.route('/test')
def test():
    name = request.args.get('name')
    return jsonify({"message": f"Hello, {name}!"})

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port='8000')