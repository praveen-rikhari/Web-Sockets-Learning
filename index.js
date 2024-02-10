const express = require('express');
const socketIo = require('socket.io');

const app = express();

const mysql = require('mysql');

// Create Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'todo',
  database: 'chat_db'
});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database: ', err);
      return;
    }
    console.log('Connected to MySQL database');
  });

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