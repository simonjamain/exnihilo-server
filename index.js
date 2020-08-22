var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let port = 3000
let players = []
let iterationInterval = 3000
let iterationTimeout = setTimeout(sendIterate, iterationInterval)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

    socket.on('setIterationInterval', (iterationIntervalReceived) => {
        iterationInterval = iterationIntervalReceived
    });

    socket.on('stopIterations', () => {
        clearTimeout(iterationTimeout)
    });

    socket.on('startIterations', () => {
        clearTimeout(iterationTimeout)
        setTimeout(sendIterate, iterationInterval)
    });

    socket.on('newPlayer', (color) => {
        players.push(players);
        io.emit('newPlayer', color);
        io.emit('allPlayers', players);
    });

    socket.on('removePlayer', (color) => {
        var index = array.indexOf(item);
        if(index != -1){
            array.splice(index, 1); 
        }
        io.emit('allPlayers', players);
    });

    socket.on('newAction', (action) => {
        io.emit('newAction', action);
    });
});


function sendIterate(){
    
    io.emit('iterate');
    iterationTimeout = setTimeout(sendIterate, iterationInterval)
}

http.listen(port, () => {
  console.log('listening on *:' + port);
});