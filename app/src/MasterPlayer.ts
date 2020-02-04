import * as videojs from 'video.js'
//import 'videojs-vr';

export class MasterPlayer {
    public videoJS = videojs.default;
    private videoPlayer: videojs.VideoJsPlayer;
    private options: videojs.VideoJsPlayerOptions;
    private videoNode : HTMLVideoElement = <HTMLVideoElement>document.getElementById("video");

    public run() {
        // setting up master player
        console.log("starting master player...");

        document.onreadystatechange = () => {
            if(document.readyState === "complete") {
                this.videoPlayer = this.videoJS("video");
                console.log("hello world");
            }
        };
    }
}
