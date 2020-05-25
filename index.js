const http = require('http');
const port= process.env.PORT || 3000;
var Player = require('./Classes/Player.js');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Welcome to Namia Online server.');
});


var io = require('socket.io').listen(server);


server.listen(port, () => {
    console.log('Server has started at port: ' + port);
    console.log('Player disconnected!. Players online: ' + Object.keys(players).length);
});
console.clear();



//#region Socketio
var players = [];
var sockets = [];


io.on('connection', function(socket){
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


    console.log('New Player!. Players online: ' + Object.keys(players).length);

    for(var playerID in players){
        if(playerID != thisPlayerID) socket.emit('spawn', players[playerID]);
    }

    socket.on('updatePosition', function(data){
        player.position.x = data.position.x;
        player.position.y = data.position.y;
        player.position.timeToLerp = data.position.timeToLerp;

        socket.broadcast.emit('updatePosition', player); 
        console.log('Move: ' + player.position.timeToLerp);
        //TODO send only position and id not the player
        // var d = {
        //     id = thisPlayerID,
        //     position = player.position
        // }
    });

    socket.on('disconnect', function(){
        delete players[thisPlayerID];
        delete socket[thisPlayerID];
        socket.broadcast.emit('disconnected', {id: thisPlayerID});
        console.log('Player disconnected!. Players online: ' + Object.keys(players).length);
    });
});
//#endregion