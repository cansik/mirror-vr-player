// web socket
let socket = new WebSocket("ws://" + location.host + "/api/player/");

var options = {fluid: true};

var player = videojs('video', options, function onPlayerReady() {
    this.vr({projection: '360', forceCardboard: true});
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