const http = require('http');
const port= process.env.PORT || 3001;
var Player = require('./Classes/Player.js');
var Attack = require('./Classes/Attack.js');
var Grid = require('./Classes/Grid.js');
var Vector3 = require('./Classes/Vector3.js');
var Vector3Int = require('./Classes/Vector3Int.js');
const { isUndefined } = require('util');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Welcome to Namia Online server.');
});


var io = require('socket.io').listen(server);


server.listen(port, () => {
    console.log('Server has started at port: ' + port);
    console.log('Players online: ' + Object.keys(players).length);
});
console.clear();



//#region Socketio
var players = [];
var sockets = [];
var clientServerSocket = [];


 

io.on('connection', function(socket){
    //Create player
    var player = new Player();
    var thisPlayerID = player.id;

    //Add player and socket to our list
    players[thisPlayerID] = player;
    sockets[thisPlayerID] = socket;

    //Tell the client that this is our id for the server
    socket.emit('register', {id: thisPlayerID});
    if(Object.keys(clientServerSocket).length > 0)
        if(typeof clientServerSocket[thisPlayerID] === 'undefined'){
            clientServerSocket[Object.keys(clientServerSocket)[0]].emit('spawnPlayerOnServer', player);
            console.log('New Player!. Spawned on server client');
        }
   
     
    // socket.emit('spawn', player); //Tell myself i have spawned
    // socket.broadcast.emit('spawn', player); //Send everybody but me


    console.log('New Player!. Players online: ' + Object.keys(players).length);

    // for(var playerID in players){
    //     if(playerID != thisPlayerID) socket.emit('spawn', players[playerID]);
    // }

    socket.on('registerClientServer', function(){
        clientServerSocket = [];
        clientServerSocket[thisPlayerID] = socket;
        console.log('Client server registered! ID: ' + thisPlayerID);
    });

    socket.on('playerSpawnedOnServer', function(data){
        socket.broadcast.emit('spawn', players[data.id]); //Send everybody but me
        console.log('playerSpawnedOnServer! ID: ' + data.id);
    });

    socket.on('moveCharacter', function(data){
        player.position.horizontal = data.horizontal;
        player.position.vertical = data.vertical;
        clientServerSocket[Object.keys(clientServerSocket)[0]].emit('moveCharacterOnServer', player);
        console.log('moveCharacter (' + player.position.horizontal + ')(' + player.position.vertical + ')');
        // player.position.horizontal = data.position.horizontal;
        // player.position.vertical = data.position.vertical;
        // player.position.timeToLerp = data.position.timeToLerp;
        // player.position.speed = data.position.speed;


    });
    socket.on('moveCharacterForEveryone', function(data){
    var datas = {
        'id': data.id,
        'position': {
            'x': String(data.position.x),
            'y': String(data.position.y)
        }
    };
        players[data.id].position.x = data.position.x;
        players[data.id].position.y = data.position.y;
        socket.broadcast.emit('moveCharacterForEveryone', datas); 
        console.log('moveCharacterForEveryone (' + datas.position.x + ')(' + datas.position.y + ')');
    });

    socket.on('ping', function(){
        socket.emit('pong');
    });
    socket.on('disconnect', function(){
        delete players[thisPlayerID];
        delete socket[thisPlayerID];
        socket.broadcast.emit('disconnected', {id: thisPlayerID});
        console.log('Player disconnected!. Players online: ' + Object.keys(players).length);
    });
});
//#endregion