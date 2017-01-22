/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cs.santaris.selecttracker.Model;

/**
 *
 * @author santaris
 */
public class Peer {
    private final String peerId;
    private final String socialId;
    
    public Peer(String peerId, String socialId) {
        this.peerId = peerId;
        this.socialId = socialId;
    }
    
    public String getPeerId() {
        return this.peerId;
    }
    
    public String getSocialId() {
        return this.socialId;
    }
}
