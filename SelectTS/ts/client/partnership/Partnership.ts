/// <reference path="../../../typings/index.d.ts" />
import collections = require("collections2");
import HashMap = collections.HashMap;
import {PeerInfo} from "../PeerInfo";
import {Member} from "../membership/Member";
import {Partner} from "./Partner";
import {Connection} from "../connectivity/Connection";
/**
 * Created by santaris on 2016-12-26.
 */


export class Partnership {

    private peerInfo:PeerInfo;
    private partnerList:HashMap<number, Partner>;

    constructor(peerInfo:PeerInfo) {
        this.peerInfo = peerInfo;
        this.partnerList = new HashMap<number, Partner>();
    }

    connectToPeer(member:Member) {
        let roomId = this.calculateRoomId(member);
        let connection = new Connection(roomId);
        connection.connect().then(() => {
            let partner = new Partner(connection);
        })
    }

    private calculateRoomId(member:Member) {
        let mySocialId = this.peerInfo.getSocialId();
        let newMemberSocialId = member.getSocialId();

        let roomId = mySocialId + "_" + newMemberSocialId;

        if(newMemberSocialId < mySocialId) {
            roomId = newMemberSocialId + "_" + mySocialId;
        }

        return roomId;
    }
}