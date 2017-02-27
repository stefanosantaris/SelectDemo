///<reference path="../../../typings/index.d.ts"/>
import Q = require('q')
import {SelectService} from "./SelectService";
import {P2PConnection} from "./p2p/P2PConnection";

/**
 * Created by santaris on 2016-12-26.
 */


export class Connection {

    private roomId:string;
    private selectService:SelectService;
    private p2pConnection:P2PConnection;
    private connectionDefer:Q.Deferred<void>;

    constructor(roomId:string) {
        this.roomId = roomId;

        this.selectService = new SelectService(this);
    }

    connect():Q.Promise<void> {
        let defer = Q.defer<void>();

        this.selectService.connect();

        this.connectionDefer = defer;

        return defer.promise;
    }


    receivedMessge(message:any, clientId:string) {
        this.p2pConnection.signalingMessageCallback(message);
    }


    sendMessage(message:any, clientId:string) {
        this.selectService.sendMessage(message, clientId);
    }

    createP2PConnection(clientId:string, isInitiator:boolean) {
        this.p2pConnection = new P2PConnection(this, clientId, isInitiator);
        this.p2pConnection.startConnection().then(() => {
            this.connectionDefer.resolve();
        })
    }
}