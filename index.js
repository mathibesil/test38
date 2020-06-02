const http = require('http');
const port= process.env.PORT || 3000;
var Player = require('./Classes/Player.js');
var Attack = require('./Classes/Attack.js');

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
        player.position.horizontal = data.position.horizontal;
        player.position.vertical = data.position.vertical;
        player.position.timeToLerp = data.position.timeToLerp;
        player.position.speed = data.position.speed;

        socket.broadcast.emit('updatePosition', player); 
        //console.log('Move: (' + player.position.horizontal + ',' + player.position.vertical + ') Speed: ' + player.position.speed);
        //TODO send only position and id not the player
        // var d = {
        //     id = thisPlayerID,
        //     position = player.position
        // }
    });

    socket.on('attack', function(data){
        var anAttack = new Attack();
        anAttack.attacker = data.attacker_id;
        anAttack.target = data.target;
        anAttack.attackPosition.x = data.attackPoint.x;
        anAttack.attackPosition.y = data.attackPoint.y;
        anAttack.attackTargetActualPosition.x = players[anAttack.target].x;
        anAttack.attackTargetActualPosition.y = players[anAttack.target].y;

        sockets[anAttack.target].emit('attack', anAttack)
        console.log('New atack from ' + anAttack.attacker + ' To ' + anAttack.target + ' From  (' + anAttack.attackPosition.x + ',' + anAttack.attackPosition.y + ')');
    });

    socket.on('attack_range', function(data){
        var anAttack = new Attack();
        anAttack.attacker = data.attacker_id;
        anAttack.target = data.proyectile;
        anAttack.attackPosition.x = data.attackPoint.x;
        anAttack.attackPosition.y = data.attackPoint.y;
        anAttack.attackTargetActualPosition.x = 0;
        anAttack.attackTargetActualPosition.y = 0;

        sockets[anAttack.attacker].broadcast.emit('attack_range', anAttack)
        console.log('New atack from ' + anAttack.attacker + ' To ' + anAttack.target + ' From  (' + anAttack.attackPosition.x + ',' + anAttack.attackPosition.y + ')');
    });

    socket.on('damage', function(data){
        console.log('Damage done to ' + data.target);
        socket.broadcast.emit('damage', {target: data.target});
    });

    socket.on('damage_proyectile', function(data){
        console.log('Damage done to ' + data.target);
        socket.broadcast.emit('damage_proyectile', {target: data.target, attacker: data.attacker_id, proyectile: data.proyectile});
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