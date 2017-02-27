/// <reference path="../../../typings/index.d.ts" />
import collections = require("collections2");
import HashMap = collections.HashMap;
import {Partnership} from "../partnership/Partnership";
import {Membership} from "../membership/Membership";
import {PeerInfo} from "../PeerInfo";
import {Member} from "../membership/Member";
import {SelectConstants} from "../SelectConstants";
/**
 * Created by santaris on 2016-12-26.
 */


export class TrackerClient {

    private TRACKER_ANNOUNCE_INTERVAL = 3000;

    private partnership:Partnership;
    private membership:Membership;
    private peerInfo:PeerInfo;
    constructor(peerInfo:PeerInfo, partnership:Partnership, membership:Membership) {
        this.partnership = partnership;
        this.membership = membership;
        this.peerInfo = peerInfo;
    }


    start() {
        this.announceCurrentMembers();
        setInterval(() => {
            this.announceCurrentMembers();
        }, this.TRACKER_ANNOUNCE_INTERVAL);

    }

    private announceCurrentMembers() {

        let memberList:Array<Member> = this.membership.getCurrentMembers();
        let myInfoStringified:string = JSON.stringify(this.peerInfo);

        let memberStringified:string = JSON.stringify(memberList);

        let finalInfo = {myInfo:myInfoStringified, membersInfo: memberStringified};

        var req = new XMLHttpRequest();

        req.setRequestHeader("Content-Type", "application/json")


        let reqUrl = "http://localhost:8080/?announce=" + finalInfo;

        req.open('POST', reqUrl);

        req.onreadystatechange = () => {
            if (req.readyState == 4 && req.status == 200) {
                let jsonList = JSON.parse(req.responseText);
                this.membership.newMemberListJson(jsonList);
            }
        };


        req.onerror = (event) => {
            // TODO verify error handling
        };

        // finally execute our internal xhr
        req.send(finalInfo);
    }


}