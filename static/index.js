// When the DOM is done loaded,
document.addEventListener('DOMContentLoaded', () => {
    
    // If a user has no display name, prompt them to make one
    if(!sessionStorage.getItem('name')) {
        $('#modal').modal({ show:true, focus:true, keyboard:false, backdrop:'static' })
    } else {
        var name = sessionStorage.getItem('name')
    };

    // Set channel to general if user has no session value
    if(!sessionStorage.getItem('channel')) {
        sessionStorage.setItem('channel', 'general');
    } else {
        var channel = sessionStorage.getItem('channel')
    }

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected,
    socket.on('connect', () => {

        // Disply the default channel
        socket.emit('change', {'channel': channel});
        
        // Join in a user
        document.querySelector('#join').onsubmit = () => {
            const name = document.querySelector('#name').value;
            if (!name) {
                document.querySelector('#user_message').innerHTML = "No user name";
                return false;
            } else {
                // Save user name in client-side memory
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

        // Change the channel
        document.querySelector('#channels').onchange = function() {
            const channel = this.value;
            socket.emit('change', {'channel': channel});
        };

        // Leave the user
        document.querySelector('#leave').onclick = () => {
            socket.emit('leave', {'name': name});
            sessionStorage.clear();
            location.reload();
        };
    });

    socket.on('new user', data => {
        // update user list
    });

    socket.on('new channel', data => {
        // update channel list
    });

    socket.on('change channel', data => {
        // Save channel name in client-side memory
        const channel = data.channel;
        sessionStorage.setItem('channel', channel);
        // Display messages
        const messages = data.messages;
        document.querySelector('#messages').innerHTML = "";
        messages.forEach(message => {
            const li = document.createElement('li');
            li.innerHTML = message;
            document.querySelector('#messages').append(li);
        });
    });

    socket.on('remove name', data => {
        // remove name from current users
    });
    
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