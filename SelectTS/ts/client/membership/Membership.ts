/// <reference path="../../../typings/index.d.ts" />
import collections = require("collections2");
import HashMap = collections.HashMap;
import {PeerInfo} from "../PeerInfo";
import {Member} from "./Member";
import {Partnership} from "../partnership/Partnership";
/**
 * Created by santaris on 2016-12-26.
 */


export class Membership {

    private peerInfo: PeerInfo;
    private partnership: Partnership;
    private memberList:HashMap<number,Member>;

    constructor(peerInfo: PeerInfo, partnership:Partnership) {
        this.peerInfo = peerInfo;
        this.partnership = partnership;
        this.memberList = new HashMap<number, Member>();
    }

    getCurrentMembers():Array<Member> {
        return this.memberList.values();
    }

    newMemberListJson(memberListAsJson:any) {
        memberListAsJson.membersInfo.forEach((member) => {
            let newMember = new Member(member.socialId, member.immutable_guid, member.mutable_guid);
            if(!this.memberList.has(member.socialId)) {
                this.memberList.set(member.socialId, newMember);
                this.partnership.connectToPeer(newMember);
            } else {
                this.memberList.set(member.socialId, newMember);
            }
        });
    }


}