const http = require('http');
const port=process.env.PORT || 52300;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Welcome to Namia Online server.');
});


var io = require('socket.io').listen(server);


server.listen(port, () => {
    console.log('Server has started at port: ' + port);
});
console.clear();



//#region Socketio
//Custom Classes
var Player = require('./Classes/Player.js');

var players = [];
var sockets = [];


io.on('connection', function(socket){
    console.log('Connection Made!' + socket);
    
    
    //Create player
    var player = new Player();
    var thisPlayerID = player.id;

    //Add player and socket to our list
    players[thisPlayerID] = player;
    sockets[thisPlayerID] = socket;

    //Tell the client that this is our id for the server
    socket.emit('register', {id: thisPlayerID});
    socket.emit('spawn', player); //Tell myself i have spawned
    socket.broadcast.emit('spawn', player); //Send everybody but me


    console.log('Players online: ' + Object.keys(players).length);

    for(var playerID in players){
        if(playerID != thisPlayerID) socket.emit('spawn', players[playerID]);
    }

    socket.on('disconnect', function(socket){
        console.log('Disconnected!');
        delete players[thisPlayerID];
        delete socket[thisPlayerID];
        console.log('Players online: ' + Object.keys(players).length);
    });
});
//#endregion