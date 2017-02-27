/**
 * Created by santaris on 2016-12-26.
 */

export class PeerInfo {
    private socialId:number;
    private immutable_guid:string;
    private mutable_guid:number;

    constructor(socialId:number, immutableGuid?:string, mutableGuid?:number) {
        this.socialId = socialId;
        this.immutable_guid = immutableGuid;
        this.mutable_guid = mutableGuid;
    }

    public setImmutableGuid(immutableGuid:string) {
        this.immutable_guid = immutableGuid;
    }

    public setMutableGuid(mutableGuid:number) {
        this.mutable_guid = mutableGuid;
    }

    public getSocialId(): number {
        return this.socialId;
    }

    public getImmutableGuid():string {
        return this.immutable_guid;
    }

    public getMutableGuid():number {
        return this.mutable_guid;
    }
}