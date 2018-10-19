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
    return render_template("index.html", channels=channels)

# When a user wants to create a new display name,
@app.route("/user", methods=["POST"])
def user():
    user = request.form.get('user')
    if user in users:
        return 'overlap'
    else:
        users.append(channel)
        
# When a user wants to create a new channel,
@app.route("/channel", methods=["POST"])
def channel():
    channel = request.form.get('channel')
    if channel in channels:
        return 'overlap'
    else:
        channels.append(channel)
