// When the DOM is done loaded,
document.addEventListener('DOMContentLoaded', () => {
    
    // If a user has no display name, prompt them to make one
    if(!sessionStorage.getItem('name')) {
        $('#modal').modal({ show:true, focus:true, keyboard:false, backdrop:'static' })
    } else {
        var name = sessionStorage.getItem('name')
        document.querySelector('#username').innerHTML = name;
    };

    // Set channel to general if user has no session value
    if(!sessionStorage.getItem('channel')) {
        sessionStorage.setItem('channel', 'general');
    } else {
        var channel = sessionStorage.getItem('channel');
    };

    // Connect to websocket
    const url = location.protocol + '//' + document.domain + ':' + location.port;
    var socket = io.connect(url);

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

        // Send a message
        document.querySelector('#send').onsubmit = () => {
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

        // Change the channel (button-way)
        document.querySelectorAll('.channel').forEach(button => {
            button.onclick = () => {
                const channel = button.dataset.channel;
                socket.emit('change', {'channel': channel});
            }
        });
        // (select-way)
        /* })
        document.querySelector('#channels').onchange = function() {
            const channel = this.value;
            socket.emit('change', {'channel': channel});
        }; */

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

    socket.on('new message', (data, channel_name) => {
        const channel = sessionStorage.getItem('channel');
        if (channel === channel_name) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${data.name}</strong>: ${data.message} ${data.time}`;
            document.querySelector('#messages').append(li);
        } else {
            return false;
        }
    });


    // update channel list
    socket.on('new channel', data => {

    });

    // Load channel data
    socket.on('change channel', data => {
        // Save channel name in client-side memory
        sessionStorage.setItem('channel', data.channel);
        document.querySelector('#channelname').innerHTML = data.channel;
        const messages = data.messages;
        document.querySelector('#messages').innerHTML = "";
        messages.forEach(data => {
            const li = document.createElement('li');
            if (!data.time) data.time=""
            li.innerHTML = `<strong>${data.name}</strong>: ${data.message} ${data.time}`;
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