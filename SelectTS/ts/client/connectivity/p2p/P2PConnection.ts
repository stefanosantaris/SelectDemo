/// <reference path="../../../../typings/index.d.ts" />
import Q = require('q');
import {Connection} from "../Connection";
/**
 * Created by santaris on 2016-12-26.
 */


export class P2PConnection {

    private connection: Connection;
    private isInitiator: boolean;
    private clientId: string;
    private pc;
    private dc;
    private dataChannel;

    private connectionDefer:Q.Deferred<void>;

    constructor(connection: Connection, clientId: string, isInitiator: boolean) {
        this.connection = connection;
        this.clientId = clientId;
        this.isInitiator = isInitiator;
    }


    sendMessage(message) {
        console.log('Client sending message: ', message);
        this.connection.sendMessage(message, this.clientId);
        // socket.emit('message', message, newClient);
    }


    logError(err) {
        console.log(err.toString(), err);
    }

    onLocalSessionCreated(desc) {
        // console.log('local session created:', desc);
        this.pc.setLocalDescription(desc, function () {
            console.log('sending local desc:', this.pc.localDescription);
            this.sendMessage(this.pc.localDescription);
        }, this.logError);
    }

    startConnection(): Q.Promise<void> {
        let defer = Q.defer<void>();
        this.connectionDefer = defer;
        let config = null;
        console.log("Creating Peer connection as initiator? " + this.isInitiator + " config " + config);
        this.pc = new RTCPeerConnection(config);

        this.pc.onicecandidate = (event) => {
            // console.log('icecandidate event:', event);
            if (event.candidate) {
                this.sendMessage({
                    type: 'candidate',
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate
                });
            }
            // else {
            //     console.log('End of candidates.');
            // }
        };


        if (this.isInitiator) {
            // console.log('Creating Data Channel');
            this.dc = this.pc.createDataChannel('dc_' + this.clientId);

            console.log('Creating an offer');
            this.pc.createOffer(this.onLocalSessionCreated, this.logError);
        } else {
            this.pc.ondatachannel = (event) => {
                // console.log('ondatachannel:', event.channel);
                this.dataChannel = event.channel;
                this.onDataChannelCreated(this.dataChannel);
            };
        }

        return defer.promise;
    }


    onDataChannelCreated(channel) {
        // console.log('onDataChannelCreated:', channel);

        channel.onopen =  ()  => {

            this.connectionDefer.resolve();

            if (this.isInitiator) {
                //TODO START SENDING OR DO SOMETHING
            }
            console.log('CHANNEL opened!!!');

        };

        // channel.onmessage = receiveData;
    }


    signalingMessageCallback(message) {
        if (message.type === 'offer') {
            console.log('Got offer. Sending answer to peer.');
            this.pc.setRemoteDescription(new RTCSessionDescription(message), function () {
                },
                this.logError);
            this.pc.createAnswer(this.onLocalSessionCreated, this.logError);

        } else if (message.type === 'answer') {
            console.log('Got answer.');
            this.pc.setRemoteDescription(new RTCSessionDescription(message), function () {
                },
                this.logError);

        } else if (message.type === 'candidate') {
            this.pc.addIceCandidate(new RTCIceCandidate({
                candidate: message.candidate
            }));

        } else if (message === 'bye') {
            // TODO: cleanup RTC connection?
        }
    }

}