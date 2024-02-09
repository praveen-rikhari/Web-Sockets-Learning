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

    socket.on('chat-msg', (msg) => {
        io.emit('chat-msg', msg);
    })

    socket.on('disconenct', () => {
        console.log("A user Disconnect");
    })
})