// web socket
let socket = new WebSocket("ws://" + location.host + "/api/player/");

var options = {};

var player = videojs('video', options, function onPlayerReady() {
    this.vr({projection: '360', forceCardboard: true});

    // start VR View
    this.play();
    this.vr().handleVrDisplayActivate_();

    setTimeout(function(){
        this.pause();
        this.currentTime(0);
        }.bind(this), 200);
});

// socket methods
socket.onopen = function (e) {
    socket.send("vr player connected");
};

socket.onmessage = function (event) {
    let message = event.data;
    console.log(`[message] ${message}`);

    if (message === "play") {
        player.play();
        return;
    }

    if (message === "pause") {
        player.pause();
        return;
    }

    if (message === "reset") {
        player.currentTime(0);
        return;
    }
};

socket.onclose = function (event) {
    if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('[close] Connection died');
    }
};

socket.onerror = function (error) {
    console.log(`[error] ${error.message}`);
};

// sync interval
setInterval(function () {
    if(player.paused()) {
        return;
    }

    let timeCode = player.currentTime();
    socket.send(`sync ${timeCode}`);
}, 1000);