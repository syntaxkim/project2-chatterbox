# Built-in libraries
import os
from collections import deque
from datetime import datetime, timedelta

# External libraries
from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room

# Custom library
from exchangerateapi import get_currency_list, get_exchange_rate

app = Flask(__name__)
app.config["SECRET_KEY"] = os.urandom(24)
socketio = SocketIO(app)

# Server-side memory
users = set()
channels = {"general": deque([], maxlen=100)}
currency_list = get_currency_list()

# for development
channels["general"].append({"name": "general", "message": "Welcome to Chatterbox"})
channels["channel 1"] = deque([], maxlen=100)
channels["channel 1"].append({"name": "channel 1", "message": "This is channel 1"})
channels["channel 2"] = deque([], maxlen=100)
channels["channel 2"].append({"name": "channel 2", "message": "This is channel 2"})

@app.route("/")
def index():
    return render_template("index.html", channels=list(channels), users=list(users), currency_list=currency_list)

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
    # If user asks for exchange rate,
    text = json["message"].upper().split()
    if len(text) <= 2 and text[-1] in currency_list:

        if len(text) == 1:
            quantity = 1
            base = text[0]
        elif len(text) == 2:
            quantity = int(text[0])
            base = text[1]

        try:
            exchange_rate = get_exchange_rate(base)
            json["message"] = f"{quantity} {base} is equal to {exchange_rate * quantity:.2f} KRW"
        except:
            json["message"] = "ERROR: API request unsuccessful."

    time = get_time()
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
        time = get_time()
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

def get_time():
    return (datetime.now() + timedelta(hours=9)).strftime("%I:%M %p")

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0")