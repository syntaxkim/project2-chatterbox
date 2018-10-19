// When the DOM is done loaded,
document.addEventListener('DOMContentLoaded', () => {
    
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected,
    socket.on('connect', () => {
        socket.emit('event', {data: 'Hello'})
    });

    // If a user has no display name, prompt them to make one
    if(!sessionStorage.getItem('name')) {
        document.querySelector('#main').style.display = 'none';
    } else {
        document.querySelector('#first').style.display = 'none';
    };

    // Join with a new display name,
    document.querySelector('#join').onsubmit = join;
    
    // Create a new channel,
    document.querySelector('#create').onsubmit = create;

    // When changing channel, (explicit function required)
    document.querySelector('#change').onchange = change;

    // When the user leaves, clear the user's name and reload the page
    document.querySelector('#leave').onclick = leave;
    
});

function join() {

    // Create an Ajax object
    const request = new XMLHttpRequest();
    const name = document.querySelector('#name').value;

    // Check if name is valid
    if (!name) {
        document.querySelector('#user_message').innerHTML = "No user name";
        return false;
    };

    // Connect to server
    request.open('POST', '/join');

    request.onload = () => {
        // If the same name already exists,
        if (request.responseText === "overlap") {
            document.querySelector('#user_message').innerHTML = "The same name already exists";
        } else {
            sessionStorage.setItem('name', name);
            location.reload();
        };
    };

    // Send a new channel name to server
    const data = new FormData();
    data.append('name', name);
    request.send(data);
    // Stay in the page and wait for the response
    return false;
};

function create() {

    // Create an Ajax object
    const request = new XMLHttpRequest();
    const channel = document.querySelector('#channel_name').value;

    // Check if channel name is valid
    if (!channel) {
        document.querySelector('#channel_message').innerHTML = "No channel name";
        return false;
    };
    
    // Connect to server
    request.open('POST', '/create');
    
    request.onload = () => {
        // If the same name already exists,
        if (request.responseText === "overlap") {
            document.querySelector('#channel_message').innerHTML = "The same channel name already exists";
        } else {
            location.reload();
            alert("A new channel has been created");
        };
    };

    // Send a new channel name to server
    const data = new FormData();
    data.append('channel', channel);
    request.send(data);
    // Stay in the page and wait for the response
    return false;
};

function change() {
    document.querySelector('#chatroom').innerHTML = this.value;
}

function leave() {
    const request = new XMLHttpRequest();
    const name = sessionStorage.getItem('name')
    request.open('POST', '/leave');

    request.onload = () => {
        sessionStorage.clear();
        location.reload();
    };

    const data = new FormData();
    data.append('name', name);
    request.send(data);
    return false;
};