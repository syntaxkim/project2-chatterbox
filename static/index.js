// When the DOM is done loaded,
document.addEventListener('DOMContentLoaded', () => {
    
    // Get user name
    if(!localStorage.getItem('name')) {
        $('#modal').modal({ show:true, focus:true, keyboard:false, backdrop:'static' })
    } else {
        var name = localStorage.getItem('name')
        document.querySelector('#username').innerHTML = name;
    };

    // Get channel name
    if(!sessionStorage.getItem('channel')) {
        sessionStorage.setItem('channel', 'general');
        var channel = sessionStorage.getItem('channel');
    } else {
        var channel = sessionStorage.getItem('channel');
    };

    // Connect to websocket
    const url = location.protocol + '//' + document.domain + ':' + location.port;
    var socket = io.connect(url);

    // When connected, configure buttons
    socket.on('connect', () => {

        // Disply the default channel
        socket.emit('get messages', {'before': null, 'after': channel});
        
        // Join in a user
        document.querySelector('#join').onclick = join;

        // Send a message
        document.querySelector('#send').onsubmit = send;

        // Create a channel
        document.querySelector('#create').onclick = create;

        // Load the channel
        document.querySelectorAll('.channel').forEach(link => load(link));

        // Leave the user
        document.querySelector('#leave').onclick = leave;
    });

    function join() {
        const name = document.querySelector('#name').value;
        if (!name) {
            document.querySelector('#user_message').innerHTML = "No user name";
            return false;
        } else {
            // Save user name in client-side memory
            socket.emit('join', {'name': name}, data => {
                if (data === 1) {
                    document.querySelector('#user_message').innerHTML = "Username already taken";
                    return false;
                } else {
                    localStorage.setItem('name', name);
                    location.reload();
                };
            });
        };
    };

    function send() {
        const message = document.querySelector('#message').value;
        if (!message) {
            return false;
        } else {
            const channel = sessionStorage.getItem('channel');
            socket.emit('send', {'channel': channel, 'name': name, 'message': message});
            document.querySelector('#message').value = "";
            // Do not reload
            return false;
        };
    };
    
    function create() {
        const channel = document.querySelector('#channel_name').value;
        if (!channel) {
            document.querySelector('#channel_message').innerHTML = "No channel name";
            return false;
        } else {
            socket.emit('create', {'channel': channel}, data => {
                if (data === 1) {
                    document.querySelector('#channel_message').innerHTML = "The same channel name already exists.";
                    return false;
                } else if (data === 0) {
                    location.reload();
                    alert(`New channel: '${channel}' created.`);
                };
            });
        };
    };

    function load(link) {
        link.onclick = () => {
            const before = sessionStorage.getItem('channel');
            const after = link.dataset.channel;
            socket.emit('get messages', {'before': before, 'after': after});
        };
    };

    function leave() {
        socket.emit('leave', {'name': name});
        localStorage.clear();
        sessionStorage.clear();
        location.reload();
    };

    // Load messages
    socket.on('load messages', data => loadMessages(data));

    // Recieve a new message
    socket.on('new message', data => newMessage(data));

    // Modal for currency list
    var currency_modal = document.querySelector('#currency_modal');
    
    // Get currency list
    document.querySelector('#open_currency_list').onclick = getCurrencyList;

    // Close currency modal
    document.querySelector('#close_currency_list').onclick = () => {
        currency_modal.style.display = "none";
    };
    window.onclick = function(event) {
        if (event.target == currency_modal) {
            currency_modal.style.display = "none";
        };
    };

});

function loadMessages(data) {
    sessionStorage.setItem('channel', data.channel);
    document.querySelector('#channelname').innerHTML = data.channel;
    const messages = data.messages;
    document.querySelector('#messages').innerHTML = "";
    messages.forEach(data => newMessage(data));
};

function newMessage(data) {
    if (!data.time) data.time="";
    const li = document.createElement('li');
    li.innerHTML = `<strong>${data.name}</strong>: ${data.message} ${data.time}`;
    document.querySelector('#messages').append(li);
    scrollToBottom();
};

function scrollToBottom() {
    let messageList = document.querySelector('#message-list')
    messageList.scrollTop = messageList.scrollHeight - messageList.clientHeight;
    console.log(messageList.scrollTop);
};

function getCurrencyList() {
    const request = new XMLHttpRequest();
    request.open('GET', '/getCurrencyList');
    request.responseType = 'json';

    request.onload = () => {
        document.querySelector('#currency_list').innerHTML = '';
        const data = request.response;
        var currency_list = data.currency_list;
        currency_list.forEach(currency => {
            document.querySelector('#currency_list').append(`${currency}, `);
        });
        currency_modal.style.display = "block";    
    };

    request.send();

    return false;
}