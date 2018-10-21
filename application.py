import os

from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.urandom(24)
socketio = SocketIO(app)

# list of all users and channels
users = []
channels = ['general']

@app.route("/")
def index():
    ''' delete users in production '''
    return render_template("index.html", channels=channels, users=users)

# Join in a user
@socketio.on("join")
def join(name):
    name = name["name"]
    users.append(name)
    emit("new user", {"name": name}, broadcast=True)

# Create a channel
@socketio.on("create")
def create(channel):
    channel = channel["channel"]
    if channel in channels:
        ''' send an error '''
    else:
        channels.append(channel)
        emit("new channel", {"channel": channel}, broadcast=True)

# leave the user
@socketio.on("leave")
def leave(name):
    name = name["name"]
    if name in users:
        users.remove(name)

""" @app.route("/create", methods=["POST"])
def create():
    channel = request.form.get('channel')
    if channel in channels:
        return 'overlap'
    else:
        channels.append(channel) """