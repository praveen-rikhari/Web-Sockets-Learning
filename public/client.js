const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = input.value;
    if (msg.trim()) {
        socket.emit('chat-msg', msg.trim());
        msg = '';
    }
});

socket.on('chat-msg', (msg) => {
    const msgList = document.createElement('li');
    msgList.textContent = msg;
    messages.appendChild(msgList);
})