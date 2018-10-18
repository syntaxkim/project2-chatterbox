// Load initial name as 'name'
if (!sessionStorage.getItem('name'))
    sessionStorage.setItem('name', 'No Name');

// When the DOM is done loaded,
document.addEventListener('DOMContentLoaded', () => {
    
    // Set h1.innerHTML to session storage name value
    document.querySelector('h1').innerHTML = sessionStorage.getItem('name');

    // When a user joins with a new display name,
    document.querySelector('#join').onsubmit = () => {
        // Save user's name into name variable
        let name = document.querySelector('#name').value;
        // Set h1.innerHTML to newly joined user's display name
        document.querySelector('h1').innerHTML = name;
        // Keep user's name inside session storage
        sessionStorage.setItem('name', name);
    };

    // When the user leaves,
    document.querySelector('#leave').onclick = () => {
        // clear the user's name
        sessionStorage.clear();
        // Reload the page
        location.reload();
    };
});

// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

// When connected,
socket.on('connect', () => {
    socket.emit('event', {data: 'Hello'});
});