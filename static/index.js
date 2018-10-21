// When the DOM is done loaded,
document.addEventListener('DOMContentLoaded', () => {
    
    // If a user has no display name, prompt them to make one
    if(!sessionStorage.getItem('name')) {
        $('#modal').modal({ show:true, focus:true, keyboard:false, backdrop:'static' })
    } else {
        var name = sessionStorage.getItem('name')
    };

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected,
    socket.on('connect', () => {
        
        // Join in a user
        document.querySelector('#join').onsubmit = () => {
            const name = document.querySelector('#name').value;
            if (!name) {
                document.querySelector('#user_message').innerHTML = "No user name";
                return false;
            } else {
                sessionStorage.setItem('name', name);
                socket.emit('join', {'name': name});
            };
        };

        // Create a channel
        document.querySelector('#create').onsubmit = () => {
            const channel = document.querySelector('#channel_name').value;
            if (!channel) {
                document.querySelector('#channel_message').innerHTML = "No channel name";
                return false;
            } else {
                socket.emit('create', {'channel': channel});
            };
        };

        // Leave the user
        document.querySelector('#leave').onclick = () => {
            socket.emit('leave', {'name': name});
            sessionStorage.clear();
            location.reload();
        }
    });

    // When changing channel, (explicit function required)
    /* document.querySelector('#change').onchange = () => {
        document.querySelector('#chatroom').innerHTML = this.value;
    }; */
    
});


// Ajax function
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