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
        var channel = sessionStorage.getItem('channel');
    } else {
        var channel = sessionStorage.getItem('channel');
    };

    console.log(document.querySelector('#message-list').scrollHeight);

    // Connect to websocket
    const url = location.protocol + '//' + document.domain + ':' + location.port;
    var socket = io.connect(url);

    // When connected, configure buttons
    socket.on('connect', () => {

        // Disply the default channel
        socket.emit('change', {'before': null, 'after': channel});
        
        // Join in a user
        document.querySelector('#join').onclick = () => {
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
                        sessionStorage.setItem('name', name);
                        location.reload();
                    };
                });
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
        document.querySelector('#create').onclick = () => {
            const channel = document.querySelector('#channel_name').value;
            if (!channel) {
                document.querySelector('#channel_message').innerHTML = "No channel name";
                return false;
            } else {
                socket.emit('create', {'channel': channel}, data => {
                    if (data === 1) {
                        document.querySelector('#channel_message').innerHTML = "The same channel name already exists.";
                        return false;
                    } else {
                        location.reload();
                        alert(`New channel: '${channel}' created.`);
                    };
                });
            };
        };

        // Change the channel
        document.querySelectorAll('.channel').forEach(link => {
            link.onclick = () => {
                const before = sessionStorage.getItem('channel');
                const after = link.dataset.channel;
                socket.emit('change', {'before': before, 'after': after});
            };
        });

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

    socket.on('new message', (data) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${data.name}</strong>: ${data.message} ${data.time}`;
        document.querySelector('#messages').append(li);
        scrollToBottom();
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
        scrollToBottom();
    });

    socket.on('remove name', data => {
        // remove name from current users
    });
    
});

function scrollToBottom() {
    var ch = document.querySelector('#message-list').clientHeight;
    var sh = document.querySelector('#message-list').scrollHeight;
    var overflow = sh-ch
    if ( overflow > 0) {
        document.querySelector('#message-list').scrollTo(0, overflow);
    };
}
