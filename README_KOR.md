# Project 2 - Chatterbox (JavaScript)

한국어: [README_KOR.md](https://github.com/syntaxkim/project2-chatterbox/blob/master/README_KOR.md)

JavaScript로 구현한 싱글 페이지 애플리케이션(SPA)입니다. 온라인 메시징 서비스를 제공합니다.


## 기능

### 실시간 메시징
소켓을 활용한 전이중(Full-duplex) 통신으로 다수의 유저와 채팅이 가능합니다.

### 채널 생성
기본 채널에 더해 접속자가 원하는 만큼 새로운 채널 생성이 가능합니다.

### 유저 기억
유저의 이름은 로컬 스토리지, 채널은 세션 스토리지에 각각 저장되게 하였습니다.

## 기타
* 애플리케이션은 [Heroku](https://www.heroku.com)에서 호스팅 됩니다.
* 서버의 자동 휴면 기능으로 인해 접속 시 약간의 지연이 있을 수 있습니다.


## Languages and Tools
* Languages: Python 3.7, JavaScript ES6
* Frameworks and Libraries: Socket.IO, Flask, Bootstrap, jQuery
