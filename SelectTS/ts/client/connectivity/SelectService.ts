/// <reference path="../../../typings/index.d.ts"/>

/**
 * Created by santaris on 2016-12-26.
 */

import socketIo = require('socket.io');
import {Connection} from "./Connection";

export class SelectService {

    private socket;
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
        this.socket = socketIo.connect();
        this.registerHandlers();
    }

    connect() {
        this.socket.emit('create or join');
    }

    private registerHandlers() {
        this.socket.on('ipaddr', (ipaddr) => {
            console.log('Server IP address is: ' + ipaddr);
        });

        this.socket.on('created', (room, clientId) => {
            console.log('Created room' + room + '- my client ID is' + clientId);
            this.connection.createP2PConnection(clientId, true);
        });

        this.socket.on('joined', (room, clientId) => {
            console.log('This peer has joined room' + room + 'with client ID' + clientId);
            this.connection.createP2PConnection(clientId, false);
        });

        this.socket.on('ready', (clientId) => {
            console.log('Socket is ready');
            this.connection.createP2PConnection(clientId, true);
        });

        this.socket.on('log', function (array) {
            console.log.apply(console, array);
        });

        this.socket.on('message', function (message, clientId) {
            this.connection.receivedMessge(message, clientId);
        });
    }

    sendMessage(message, clientId) {
        this.socket.emit('message', message, clientId)
    }
}