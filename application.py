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
channels["channel1"] = deque([], maxlen=100)
channels["channel1"].append({"name": "channel1", "message": "This is channel 1"})
channels["channel2"] = deque([], maxlen=100)
channels["channel2"].append({"name": "channel2", "message": "This is channel 2"})

@app.route("/")
def index():
    ''' delete users in production '''
    return render_template("index.html", channels=list(channels), users=list(users))

# Join in a user
@socketio.on("join")
def join(json):
    name = json["name"]
    if name in users:
        return 1
    else:
        users.add(name)
        emit("new user", {"name": name}, broadcast=True)

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
        channels[channel] = deque([], maxlen=100)
        channels[channel].append({"name": channel, "message": "New channel created"})
        return 0
        # emit("new channel", {"channel": channel}, broadcast=True)

# Change the channel
@socketio.on("change")
def change(json):
    before = json["before"]
    leave_room(before)
    channel = json["after"]
    join_room(channel)
    emit("change channel", {"channel": channel, "messages": list(channels[channel])})

# leave the user
@socketio.on("leave")
def leave(json):
    name = json["name"]
    if name in users:
        users.remove(name)
        emit("remove name", {"name": name}, broadcast=True)

if __name__ == "__main__":
    socketio.run(app)