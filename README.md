# Project 2 - Chatterbox (JavaScript)

한국어: [README_KOR.md](https://github.com/syntaxkim/project2-chatterbox/blob/master/README_KOR.md)

A single-page application(SPA) which is an online messaging service using Flask and JavaScript.


## Features

### Real-time communication
Full-duplex communication with multiple users by using socket.

### Create your own channel
You can create your own channel as many as you want. Multiple channels are implemented by using Python's dictionary(hash table) and deque(stack).

### Save user information
Username and channel name are saved in local and session storage each.

## Notes
* The application is deployed with [Heroku](https://www.heroku.com).
* Due to server's automatic sleep function, a short delay could occur to reboot the application.
* Manually set time to South Korea as hosting server is located in United States.


## Languages and Tools
* Languages: Python 3.7, JavaScript ES6
* Frameworks and Libraries: Socket.IO, Flask, Bootstrap, jQuery
