var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let port = process.argv[2] || 3000
let players = []
let gameStartTime = Date.now()

let size = {
    rows : 40,
    cols : 40
}

let newSpecialCellIntervalMin = 5000
let newSpecialCellIntervalMax = 10000
let newSpecialCellTimeout = setTimeout(sendSpecialCell, newSpecialCellIntervalMin + Math.random() * (newSpecialCellIntervalMax - newSpecialCellIntervalMin))

let iterationInterval = 5000
let iterationTimeout = setTimeout(sendIterate, iterationInterval)

let newAmunitionInterval = 1800
let newAmmunitionTimeout = setTimeout(sendNewAmmunition, newAmunitionInterval)

let history = []

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

    // ------------- iterations -----------------
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
    
    // ------------- ammunitions -----------------
    socket.on('setNewAmmunitionInterval', (newAmmunitionIntervalReceived) => {
        newAmunitionInterval = newAmmunitionIntervalReceived
    });

    socket.on('stopNewAmmunition', () => {
        clearTimeout(newAmmunitionTimeout)
    });

    socket.on('startNewAmmunition', () => {
        clearTimeout(newAmmunitionTimeout)
        setTimeout(sendNewAmmunition, newAmunitionInterval)
    });
    
    // ------------- players -----------------

    socket.on('newPlayer', (playerColor) => {

        players.push(playerColor);
        history.push(new PlayerEvent(playerColor, 1))
        io.emit('newPlayer', playerColor);
        io.emit('allPlayers', players);
    });

    socket.on('removePlayer', (playerColor) => {
        var index = players.indexOf(playerColor);
        if(index != -1){
            players.splice(index, 1); 
        }
        history.push(new PlayerEvent(playerColor, -1))
        io.emit('allPlayers', players);
    });

    // ------------- actions -----------------

    socket.on('newAction', (action) => {
        history.push(new ActionEvent(action))
        io.emit('newAction', action);
    });
});

http.listen(port, () => {
    console.log('listening on *:' + port);
  });

function sendNewAmmunition(){
    
    history.push(new AmmunitionEvent())
    io.emit('newAmmunition', newAmunitionInterval);
    newAmmunitionTimeout = setTimeout(sendNewAmmunition, newAmunitionInterval)
}

function sendIterate(){

    history.push(new IterationEvent())
    io.emit('iterate', iterationInterval)
    iterationTimeout = setTimeout(sendIterate, iterationInterval)
}

function sendSpecialCell(){
    const row = Math.floor(Math.random() * size.rows)
    const col = Math.floor(Math.random() * size.cols)
    const randNumber = Math.random()

    specialCellEvent = new SpecialCellEvent(row, col, randNumber)
    history.push(specialCellEvent)
    io.emit('newSpecialCell', specialCellEvent);

    newSpecialCellTimeout = setTimeout(sendSpecialCell, newSpecialCellIntervalMin + Math.random() * (newSpecialCellIntervalMax - newSpecialCellIntervalMin))
}

class HistoryEvent {
    constructor(){
        this.time = getElapsedTime()
    }
}

class IterationEvent extends HistoryEvent {
    constructor(){
        super()
        this.type = "iteration"
    }
}

class SpecialCellEvent extends HistoryEvent {
    constructor(row, col, randNumber){
        super()
        this.type = "specialCell"
        this.row = row
        this.col = col
        this.randNumber
    }
}

class ActionEvent extends HistoryEvent {
    constructor(action){
        super()
        this.type = "action"
        this.action = action
    }
}

class AmmunitionEvent extends HistoryEvent {
    constructor(action){
        super()
        this.type = "ammunition"
    }
}

class PlayerEvent extends HistoryEvent {
    constructor(action, playerColor, direction){
        super()
        this.type = "player"
        this.playerColor = playerColor
        this.direction = direction
    }
}

function getElapsedTime(){
    return Date.now() - gameStartTime
}