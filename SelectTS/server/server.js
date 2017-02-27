'use strict';

var os = require('os');
var nodeStatic = require('node-static');
var http = require('http');
var socketIO = require('socket.io');

var fileServer = new (nodeStatic.Server)();
var app = http.createServer(function (req, res) {
    fileServer.serve(req, res);
}).listen(3033);

var roomIds = [];

// var roomId = 'evaluateRoom';

var io = socketIO.listen(app);
io.sockets.on('connection', function (socket) {

    // var leaderSocket;
    // convenience function to log server messages on the client
    function log() {
        var array = ['Message from server:'];
        array.push.apply(array, arguments);
        socket.emit('log', array);
    }

    socket.on('message', function (message, socketId) {
        log('Client ' + socket.id + ' said: ', message);
        io.sockets.connected[socketId].emit('message', message, socket.id);
    });

    socket.on('create or join', function (roomId) {
        // log('Received request to create or join room ' + room);

        var numClients = io.sockets.sockets.length;
        log('Room ' + roomId + ' now has ' + numClients + ' client(s)');

        if (numClients === 1) {
            socket.join(roomId);
            log('Client ID ' + socket.id + ' created room ' + roomId);
            // console.log(room);
            socket.emit('created', roomId, socket.id);
            roomIds.push({roomId: roomId, leaderSocket:socket});
            // leaderSocket = socket;
        } else if (numClients <= 2) {
            log('Client ID ' + socket.id + ' joined room ' + roomId);
            // io.sockets.in(room).emit('join', room);
            socket.join(roomId);
            socket.emit('joined', roomId, socket.id);
            roomIds[roomId].emit('ready', socket.id);
            // leaderSocket.emit('ready', socket.id);
            // io.sockets.in(room).emit('ready', socket.id);
            // socket.broadcast.emit('ready', room);
        } else { // max two clients
            socket.emit('full', roomId);
        }

        // console.log(io.sockets.connected)
    });

    socket.on('ipaddr', function () {
        var ifaces = os.networkInterfaces();
        for (var dev in ifaces) {
            ifaces[dev].forEach(function (details) {
                if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
                    socket.emit('ipaddr', details.address);
                }
            });
        }
    });

    socket.on('bye', function () {
        console.log('received bye');
    });

});
