var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('newPlayer', (color) => {
        io.emit('newPlayer', color);
    });
    socket.on('newAction', (action) => {
        io.emit('newAction', action);
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});