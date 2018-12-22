# Project 2 - Chatterbox (JavaScript)

English: [README.md](https://github.com/syntaxkim/project2-chatterbox/blob/master/README.md)

JavaScript로 구현한 싱글 페이지 애플리케이션(SPA)입니다. 소켓을 활용한 전이중(Full-duplex) 통신 온라인 메시징 서비스를 제공합니다.

데모: https://minsu-chatterbox.herokuapp.com/
![chatroom](https://raw.githubusercontent.com/syntaxkim/project2-chatterbox/master/screenshots/screenshot2.png)

## 기능

### 유저 기억
유저의 이름은 로컬 스토리지, 채널은 세션 스토리지에 각각 저장되게 하였습니다.
![join](https://raw.githubusercontent.com/syntaxkim/project2-chatterbox/master/screenshots/screenshot0.png)

### 채널 생성
기본 채널에 더해 접속자가 원하는 만큼 새로운 채널 생성이 가능합니다. Python의 hast table 자료구조인 dictionary와 deque 자료구조인 deque를 사용해 다수 채널을 구현하였습니다.

자료 구조
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

### 실시간 환율 정보 (추가 기능)
KRW 기준으로 환율 정보를 제공합니다.
![exchangerate](https://raw.githubusercontent.com/syntaxkim/project2-chatterbox/master/screenshots/screenshot3.png)

지원되는 통화 목록을 확인할 수 있습니다. (AJAX)

![curreny list](https://raw.githubusercontent.com/syntaxkim/project2-chatterbox/master/screenshots/screenshot4.png)

API: [exchangeratesapi](https://exchangeratesapi.io/)


## Languages and Tools
* Languages: Python 3.7, JavaScript ES6
* Frameworks and Libraries: Socket.IO, Flask, Bootstrap, jQuery
