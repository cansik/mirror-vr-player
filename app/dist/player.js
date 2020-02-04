var options = { fluid: true };

var player = videojs('video', options, function onPlayerReady() {
    this.vr({projection: '360', forceCardboard: true});
});