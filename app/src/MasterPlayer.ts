import videojs from 'video.js';
//import 'videojs-vr';

export class MasterPlayer {
    private player = videojs('video', {})
    private videoNode : HTMLVideoElement = <HTMLVideoElement>document.getElementById("video")

    public run() {
        // setting up master player
        console.log("starting master player...");
    }
}
