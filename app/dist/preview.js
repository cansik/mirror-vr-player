var options = { fluid: true };

var player = videojs('video', options, function onPlayerReady() {
    videojs.log('Your player is ready!');

    // setup ui
    document.getElementById("play-button").onclick = function () {
        this.play();
    }.bind(this);

    document.getElementById("pause-button").onclick = function () {
        this.pause();
    }.bind(this);

    document.getElementById("reset-button").onclick = function () {
        this.currentTime(0);
    }.bind(this);

    // In this context, `this` is the player that was created by Video.js.
    //this.play();
    // player events
    this.on('play', function () {
        videojs.log('started playing...');
    });

    this.on('ended', function () {
        videojs.log('Awww...over so soon?!');
    });
});