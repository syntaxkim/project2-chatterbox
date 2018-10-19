import os

from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.urandom(24)
socketio = SocketIO(app)

# list of all channels
channels = ['general']

@app.route("/")
def index():
    return render_template("index.html", channels=channels)

@app.route("/channel", methods=["POST"])
def channel():
    channel = request.form.get('channel')
    if channel in channels:
        return 'The same channel name already exists.'
    else:
        channels.append(channel)
        return 'ok'
