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

// let activeUsers = [];

io.on('connection', (socket) => {
    console.log("A user connected.");

    socket.emit('request-username');

    // Listening for username submission
    socket.on('username', (username) => {
        socket.username = username;
        io.emit('chat-msg', `${username} has joined the chat.`);

        // storing  username in database
        db.query('INSERT INTO chat (username) VALUES (?)', [username], (err, results) => {
            if (err) {
                console.log("User not saved in DATABASE : ", err);
            } else {
                console.log('User added to Database.');
            }
        })
    });


    // Listening for new messages
    socket.on('chat-msg', (msg) => {
        io.emit('chat-msg', `${socket.username}: ${msg}`);

        // storing messages in database
        db.query('INSERT INTO chat (username, message) VALUES (?, ?)', [socket.username, msg], (err, results) => {
            if (err) {
                console.log("Messages not added in DATABASE : ", err);
            } else {
                console.log('Messages added to Database.');
            }
        })
    });


    //Deleting disconnected user from database
    // Listen for disconnection
    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('chat message', `${socket.username} has left the chat`);

            // Delete user's messages from database
            db.query('DELETE FROM chat WHERE username = ?', [socket.username], (error, results, fields) => {
                if (error) throw error;
            });
        }
        console.log('A user disconnected');
    });

})