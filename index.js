const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.use(express.static(__dirname + '/public'));

// initializing socket.io by passing our server instance
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log("A user connected.");

    socket.emit('request-username');

    socket.on('username', (username) => {
        socket.username = username;
        io.emit('chat-msg', `${username} has joined the chat.`);
    });

    socket.on('chat-msg', (msg) => {
        io.emit('chat-msg', `${socket.username}: ${msg}`);
    });

    socket.on('disconenct', () => {
        if (socket.username) {
            io.emit('chat-msg', `${socket.username} has left the chat`)
        }
        console.log("A user Disconnect");
    })
})