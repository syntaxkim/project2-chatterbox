// When the DOM is done loaded,
document.addEventListener('DOMContentLoaded', () => {
    
    // When a user has no display name,
    if(!sessionStorage.getItem('name')) {
        // prompt them to make one
        document.querySelector('#message').innerHTML = 'Make your username'
    } else {
        // display greeting message.
        name = sessionStorage.getItem('name')
        document.querySelector('#message').innerHTML = `Hello, ${name}`;
    }

    // When the user joins with a new display name,
    document.querySelector('#join').onsubmit = () => {
        // Check if the name is available
        let name = document.querySelector('#name').value;
        if (!name) {
            alert("You need a name.");
            return false;
        } else {
            // if the name already exists,
        }
        
        // Save the name inside session storage
        sessionStorage.setItem('name', name);
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