var options = { fluid: true };

var player = videojs('video', options, function onPlayerReady() {
    videojs.log('Your player is ready!');
    this.vr({projection: '360'});
});