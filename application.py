import os

from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.urandom(24)
socketio = SocketIO(app)

# list of all channels
channel_list = ['general']

@app.route("/")
def index():
    return render_template("index.html", channels=channel_list)

@app.route("/channel", methods=["POST"])
def channel():
    channel_name = request.form.get('channel')
    channel_list.append(channel_name)
    return redirect(url_for('index'))
    