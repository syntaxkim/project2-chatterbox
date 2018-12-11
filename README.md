# Project 2 - Chatterbox (JavaScript)

한국어: [README_KOR.md](https://github.com/syntaxkim/project2-chatterbox/blob/master/README_KOR.md)

A single-page application(SPA) which provides the full-duplex communication online messaging service using JavaScript and Socket.IO.

![chatroom](https://raw.githubusercontent.com/syntaxkim/project2-chatterbox/master/screenshots/screenshot2.png)

## Features

### Save user information
Username and channel name are saved in local and session storage each.
![join](https://raw.githubusercontent.com/syntaxkim/project2-chatterbox/master/screenshots/screenshot0.png)

### Create your own channel
You can create your own channel as many as you want. Multiple channels are implemented by using Python's dictionary(hash table) and deque(queue).

Data structures
```
channels = {"general": deque([], maxlen=100)}

    channels (dictionary)
      |
      v
    "general" (deque)
      |\____________________________
      |                             |
      v                             v
    message1 (dictionary)         message2 
      |\____________________ ____________________
      |                     |                    |
      v                     v                    v
    "name"               "message"             "time"
```

![join](https://raw.githubusercontent.com/syntaxkim/project2-chatterbox/master/screenshots/screenshot1.png)

### Get foreign exchange rates in real-time (additional feature)
The base currency is set to KRW.
![exchangerate](https://raw.githubusercontent.com/syntaxkim/project2-chatterbox/master/screenshots/screenshot3.png)

You can also look up a list of available exchange rates. (AJAX)

![curreny list](https://raw.githubusercontent.com/syntaxkim/project2-chatterbox/master/screenshots/screenshot4.png)

API: [exchangeratesapi](https://exchangeratesapi.io/)


## Languages and Tools
* Languages: Python 3.7, JavaScript ES6
* Frameworks and Libraries: Socket.IO, Flask, Bootstrap, jQuery
