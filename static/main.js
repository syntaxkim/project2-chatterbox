// When the DOM is done loaded,
document.addEventListener('DOMContentLoaded', () => {
    
    // If a user has no display name, prompt them to make one
    if(!sessionStorage.getItem('name')) {
        document.querySelector('#main').style.display = 'none';
    } else {
        document.querySelector('#first').style.display = 'none';
    };

    // When the user joins with a new display name,
    document.querySelector('#join').onsubmit = () => {
        // Check if the name is available
        const name = document.querySelector('#name').value;
        if (!name) {
            alert("You need a name.");
            return false;
        } else {
            // if the name already exists,
        }
        
        // Save the name inside session storage
        sessionStorage.setItem('name', name);
    };
    
    // When the user wants to create a new channel,
    document.querySelector('#new_channel').onsubmit = () => {

        // Create a Ajax object
        const request = new XMLHttpRequest();
        const channel = document.querySelector('#channel').value;

        // Check if channel name is valid
        if (!channel) {
            document.querySelector('#channel_message').innerHTML = "No channel name";
            return false;
        }
        
        // Connect to server
        request.open('POST', '/channel');
        
        request.onload = () => {
            // Send a message if the same channel name, else, reload the page
            if (request.responseText === "overlap") {
                document.querySelector('#channel_message').innerHTML = "The same channel name already exists";
            } else {
                location.reload();
                alert("A new channel has been created");
            }
        }

        // Send a new channel name to server
        const data = new FormData();
        data.append('channel', channel);
        request.send(data);
        // Stay in the page and wait for the response
        return false;
    }

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