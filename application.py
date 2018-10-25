import os
from collections import deque
from datetime import datetime

from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.urandom(24)
socketio = SocketIO(app)

# Server-side memory
users = set()
channels = {"general": deque([], maxlen=100)}

# for development
channels["general"].append({"name": "general", "message": "Welcome to Chatterbox"})
channels["channel 1"] = deque([], maxlen=100)
channels["channel 1"].append({"name": "channel 1", "message": "This is channel 1"})
channels["channel 2"] = deque([], maxlen=100)
channels["channel 2"].append({"name": "channel 2", "message": "This is channel 2"})

@app.route("/")
def index():
    return render_template("index.html", channels=list(channels), users=list(users))

# Join in a user
@socketio.on("join")
def join(json):
    name = json["name"]
    if name in users:
        return 1
    else:
        users.add(name)

# Send a message
@socketio.on("send")
def send(json):
    time = datetime.now().strftime("%I:%M %p")
    message = {"name": json['name'], "message": json["message"], "time": time}
    channels[json["channel"]].append(message)
    emit("new message", message, room=json["channel"])

# Create a channel
@socketio.on("create")
def create(json):
    channel = json["channel"]
    if channel in channels:
        return 1
    else:
        time = datetime.now().strftime("%I:%M %p")
        channels[channel] = deque([], maxlen=100)
        channels[channel].append({"name": channel, "message": "New channel created", "time": time})
        return 0
        # emit("new channel", {"channel": channel}, broadcast=True)

# Load messages
@socketio.on("get messages")
def get_messages(json):
    before = json["before"]
    leave_room(before)
    channel = json["after"]
    join_room(channel)
    emit("load messages", {"channel": channel, "messages": list(channels[channel])})

# leave the user
@socketio.on("leave")
def leave(json):
    name = json["name"]
    if name in users:
        users.remove(name)

@socketio.on_error()
def error_handler(e):
    print(f"An error has occured: {str(e)}")

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0")