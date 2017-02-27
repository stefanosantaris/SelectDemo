import {TrackerClient} from "./tracker/TrackerClient";
import {Partnership} from "./partnership/Partnership";
import {Membership} from "./membership/Membership";
import {PeerInfo} from "./PeerInfo";
/**
 * Created by santaris on 2016-12-26.
 */

export class SelectClient {

    private trackerClient:TrackerClient;
    private partnership:Partnership;
    private membership:Membership;
    private peerInfo:PeerInfo;
    private socialId:number;

    constructor(socialId:number) {
        this.socialId = socialId;
        console.log("Let's start the select client");

        this.peerInfo = new PeerInfo(socialId);

        this.partnership = new Partnership(this.peerInfo);
        this.membership = new Membership(this.peerInfo, this.partnership);

        this.trackerClient = new TrackerClient(this.peerInfo,this.partnership, this.membership);

    }

    start() {
        this.trackerClient.start();
    }


}
