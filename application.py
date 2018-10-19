import os

from flask import Flask, render_template, request, flash, redirect, url_for
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
    channel_name = request.form.get('channel')
    if channel_name in channels:
        flash("The same channel name already exists. Please pick another one.")
        return redirect(request.referrer)
    elif not channel_name:
        flash("Pick a channel name.")
        return redirect(request.referrer)
    else:
        channels.append(channel_name)
        return redirect(url_for('index'))
