from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__, template_folder=".")
CORS(app)

def save_user(new_user):
    if os.path.exists('Login-info.json'):
        with open('Login-info.json', 'r') as f:
            users = json.load(f)
    else:
        users = []

    users.append(new_user)

    with open('Login-info.json', 'w') as f:
        json.dump(users, f, indent=4)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    save_user(data)
    return jsonify({"status": "success", "message": "User registered!"})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not os.path.exists('Login-info.json'):
        return jsonify({"status": "error", "message": "The data is empty. Register first!"})

    with open('Login-info.json', 'r') as f:
        all_users = json.load(f)

    for i in all_users:
        if i['username'] == data['username'] and i['password'] == data['password']:
            return jsonify({"status": "success", "message": "Access Granted!", "tasks": i.get('tasks', [])})

    return jsonify({"status": "error", "message": "Invalid Userame or Password"})

@app.route('/add_task', methods=['POST'])
def add_task():
    data=request.get_json()
    username=data.get('username')
    new_task = {
        "Tname": data.get('task_name'),
        "Tdescription": data.get('task_description'),
        "Tdate": data.get('date')
    }
    if not os.path.exists('Login-info.json'):
        return jsonify({"status": "error", "message": "Database not found"})

    with open('Login-info.json', 'r+') as f:
        users=json.load(f)
        user_found = False

        for user in users:
            if user['username'] == username:
                if 'tasks' not in user:
                    user['tasks'] = []
                user['tasks'].append(new_task)
                user_found = True
                break

        if user_found:
            f.seek(0)
            json.dump(users, f, indent=4)
            f.truncate()
            return jsonify({"status": "success", "message": "Task saved!"})

    return jsonify({"status": "error", "message": "User not found!"})

@app.route('/complete_task', methods=['POST'])
def complete_task():
    data=request.get_json()
    username=data.get('username')
    task_name=data.get('task_name')

    if not os.path.exists('Login-info.json'):
        return jsonify({"status": "error", "message": "File not found"})
    
    with open('Login-info.json', 'r+') as f:
        users= json.load(f)
        for a in users:
            if a['username']==username:
                for task in a.get('tasks', []):
                    if task['Tname'] == task_name:
                        task['completed'] = True 
                        break

        f.seek(0)
        json.dump(users, f, indent=4)
        f.truncate()  

    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True)