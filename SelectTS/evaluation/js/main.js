'use strict';

/****************************************************************************
 * Initial setup
 ****************************************************************************/



var configuration = null;


// Create a random room if not already present in the URL.
var isInitiator = false;


var myId;
var clientList = [];


/****************************************************************************
 * Signaling server
 ****************************************************************************/

// Connect to the signaling server
var socket = io.connect();

socket.on('ipaddr', function (ipaddr) {
    // console.log('Server IP address is: ' + ipaddr);
});

socket.on('created', function (room, clientId) {
    // console.log('Created room', room, '- my client ID is', clientId);
    myId = clientId;
    isInitiator = true;
    calculateStats();
});

socket.on('joined', function (room, clientId, leaderId) {
    // console.log('This peer has joined room', room, 'with client ID', clientId);
    myId = clientId;
    isInitiator = false;
    createPeerConnection(isInitiator, configuration, leaderId);
});

socket.on('full', function (room) {
    alert('Room ' + room + ' is full. We will create a new room for you.');
    window.location.hash = '';
    window.location.reload();
});

socket.on('ready', function (clientId) {
    // console.log('Socket is ready');
    clientList.push(clientId);
    createPeerConnection(isInitiator, configuration, clientId);
});

socket.on('log', function (array) {
    console.log.apply(console, array);
});

socket.on('message', function (message, clientId) {
    // console.log('Client received message:', message);
    signalingMessageCallback(message, clientId);
});

// Join a room
socket.emit('create or join');

if (location.hostname.match(/localhost|127\.0\.0/)) {
    socket.emit('ipaddr');
}

/**
 * Send message to signaling server
 */
function sendMessage(message, clientId) {
    // console.log('Client sending message: ', message);
    socket.emit('message', message, clientId);
}

/****************************************************************************
 * WebRTC peer connection and data channel
 ****************************************************************************/

var peerConn = {};
var dataChannel = {};
var avgFragmentTime = {};
var sum = 0;
var counter = 0;

function signalingMessageCallback(message, clientId) {
    if (message.type === 'offer') {
        // console.log('Got offer. Sending answer to peer.');
        peerConn[clientId].setRemoteDescription(new RTCSessionDescription(message), function () {
            },
            logError);
        peerConn[clientId].createAnswer().then(function (desc) {
            onLocalSessionCreated(desc, clientId);
        });

    } else if (message.type === 'answer') {
        // console.log('Got answer.');
        peerConn[clientId].setRemoteDescription(new RTCSessionDescription(message), function () {
            },
            logError);

    } else if (message.type === 'candidate') {
        peerConn[clientId].addIceCandidate(new RTCIceCandidate({
            candidate: message.candidate
        }));

    } else if (message === 'bye') {
// TODO: cleanup RTC connection?
    }
}

function createPeerConnection(isInitiator, config, clientId) {
    // console.log('Creating Peer connection as initiator?', isInitiator, 'config:',
    //     config);
    var pc = new RTCPeerConnection(config);
    peerConn[clientId] = pc;
    avgFragmentTime[clientId] = new Array();

// send any ice candidates to the other peer
    peerConn[clientId].onicecandidate = function (event) {
        // console.log('icecandidate event:', event);
        if (event.candidate) {
            sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            }, clientId);
        }
    };

    if (isInitiator) {
        var dc = peerConn[clientId].createDataChannel('photos_' + clientId);
        dataChannel[clientId] = dc;
        onDataChannelCreated(dc, clientId);

        // console.log('Creating an offer');
        peerConn[clientId].createOffer().then(function (offer) {
            return onLocalSessionCreated(offer, clientId);
        });
    } else {
        peerConn[clientId].ondatachannel = function (event) {
            // console.log('ondatachannel:', event.channel);
            dataChannel[clientId] = event.channel;
            onDataChannelCreated(dataChannel[clientId], clientId);
        };
    }
}

function onLocalSessionCreated(desc, clientId) {
    // console.log('local session created:', desc);
    peerConn[clientId].setLocalDescription(desc, function () {
        // console.log('sending local desc:', peerConn[clientId].localDescription);
        sendMessage(peerConn[clientId].localDescription, clientId);
    }, logError);
}

function onDataChannelCreated(channel, clientId) {
    // console.log('onDataChannelCreated:', channel);

    channel.onopen = function () {

        if (isInitiator) {
            setTimeout(function () {
                sendAvailability(clientId);
            }, 200)
        }

    };

    channel.onmessage = receiveData;
}

var chunkCounter = {};


function receiveData(event) {
    var decodedMessage = JSON.parse(event.data);

    if (decodedMessage.type == "start") {
        sendRequest(decodedMessage.myId);
    } else if (decodedMessage.type == 'request') {
        sendChunk(decodedMessage.myId, decodedMessage.requestTime);
    } else if (decodedMessage.type == 'chunk') {
        if ((++chunkCounter[decodedMessage.myId]) == 20) {
            sendStop(decodedMessage.myId, decodedMessage.requestTime);
            setTimeout(function () {
                chunkCounter[decodedMessage.myId] = 0;
                sendRequest(decodedMessage.myId);
            }, 300);
        } else
            sendAck(decodedMessage.myId, decodedMessage.requestTime);

    } else if (decodedMessage.type == 'ack') {
        sendChunk(decodedMessage.myId, decodedMessage.requestTime);
    } else if (decodedMessage.type == 'received') {
        addToStats(decodedMessage.myId, decodedMessage.requestTime);
    }
}

function sendRequest(clientId) {
    // console.log("SEND REQUEST to " + clientId);
    chunkCounter[clientId] = 0;
    var requestedTime = new Date().getTime();
    var dataToSend = {type: 'request', requestTime: requestedTime, myId: myId}
    dataChannel[clientId].send(JSON.stringify(dataToSend));


}

function calculateStats() {

    setInterval(function() {
        console.log("AVERAGE LATENCY FOR " + Object.keys(peerConn).length + " PEERS IS " + (sum/counter));
        sum = 0;
        counter = 0;
    }, 1000 * 60)
}


function randomAsciiString(length) {
    // return new Promise(
    //     function (resolve, reject) {
    //         var result = '';
    //         for (var i = 0; i < length; i++) {
    //             // Visible ASCII chars are between 33 and 126.
    //             result += String.fromCharCode(33 + Math.random() * 93);
    //         }
    //         resolve(result);
    //     });

    var deferred = Q.defer();
    // return new Promise(function(resolve, reject) {
    var result = '';
    for (var i = 0; i < length; i++) {
        // Visible ASCII chars are between 33 and 126.
        result += String.fromCharCode(33 + Math.random() * 93);
    }
    // // // resolve(result);
    // // // });
    // // //
    // return result;
    // Promise.resolve(result);
    deferred.resolve(result);
    return deferred.promise;

}


function sendAvailability(clientId) {
    // console.log("SEND AVAILABILITY to " + clientId);
    var sendObject = {type: 'start', myId: myId}
    dataChannel[clientId].send(JSON.stringify(sendObject));
}

function sendAck(clientId, requestTime) {
    // console.log("SEND ACK to " + clientId)

    var dataToSend = {type: 'ack', requestTime: requestTime, myId: myId}
    dataChannel[clientId].send(JSON.stringify(dataToSend));
}


function sendStop(clientId, requestedTime) {
    // console.log("SEND STOP TO " + clientId);
    var dataToSend = {type: 'received', requestTime: requestedTime, myId: myId}
    dataChannel[clientId].send(JSON.stringify(dataToSend));
}

function sendChunk(clientId, requestTime) {
    // console.log("SEND CHUNK to " +clientId)
    var CHUNK_LEN = 32000;
    // var data = randomAsciiString(CHUNK_LEN);
    // var promise = new Promise(randomAsciiString(CHUNK_LEN));
    randomAsciiString(CHUNK_LEN).then(function (data) {

        var dataToSend = {type: 'chunk', data: data, requestTime: requestTime, myId: myId};
        dataChannel[clientId].send(JSON.stringify(dataToSend));

    });
}


function addToStats(clientId, requestTime) {
    sum += (new Date().getTime() - requestTime);
    counter++;
}


function logError(err) {
    console.log(err.toString(), err);
}
