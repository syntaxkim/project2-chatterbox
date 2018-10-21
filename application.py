import os
from collections import deque

from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.urandom(24)
socketio = SocketIO(app)

# Server-side memory
users = set()
channels = {"general": deque([], maxlen=100)}

@app.route("/")
def index():
    ''' delete users in production '''
    return render_template("index.html", channels=list(channels), users=list(users))

# Join in a user
@socketio.on("join")
def join(data):
    name = data["name"]
    if name in users:
        return False
    else:
        users.add(name)
        emit("new user", {"name": name}, broadcast=True)

# Create a channel
@socketio.on("create")
def create(data):
    channel = data["channel"]
    if channel in channels:
        return False
    else:
        channels[channel] = deque([], maxlen=100)
        emit("new channel", {"channel": channel}, broadcast=True)

# leave the user
@socketio.on("leave")
def leave(data):
    name = data["name"]
    if name in users:
        users.remove(name)

""" @app.route("/create", methods=["POST"])
def create():
    channel = request.form.get('channel')
    if channel in channels:
        return 'overlap'
    else:
        channels.append(channel) """