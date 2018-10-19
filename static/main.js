// When the DOM is done loaded,
document.addEventListener('DOMContentLoaded', () => {
    
    // If a user has no display name, prompt them to make one
    if(!sessionStorage.getItem('name')) {
        document.querySelector('#main').style.display = 'none';
    } else {
        document.querySelector('#first').style.display = 'none';
    };

    // When the user joins with a new display name,
    document.querySelector('#join').onsubmit = new_user
    
    // When the user wants to create a new channel,
    document.querySelector('#create').onsubmit = () => {

        // Create an Ajax object
        const request = new XMLHttpRequest();
        const channel = document.querySelector('#channel').value;

        // Check if channel name is valid
        if (!channel) {
            document.querySelector('#channel_message').innerHTML = "No channel name";
            return false;
        };
        
        // Connect to server
        request.open('POST', '/channel');
        
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

    // When the user leaves, clear the user's name and reload the page
    document.querySelector('#leave').onclick = () => {
        sessionStorage.clear();
        location.reload();
    };

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected,
    socket.on('connect', () => {
        socket.emit('event', {data: 'Hello'})
    });

});

function new_user() {

    // Create an Ajax object
    const request = new XMLHttpRequest();
    const name = document.querySelector('#name').value;

    // Check if name is valid
    if (!name) {
        document.querySelector('#user_message').innerHTML = "No user name";
        return false;
    };

    // Connect to server
    request.open('POST', '/user');

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