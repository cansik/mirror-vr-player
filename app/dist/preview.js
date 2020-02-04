var options = { fluid: true };

// web socket
let socket = new WebSocket("ws://" + location.host + "/api/player/");

// player
var player = videojs('video', options, function onPlayerReady() {
    videojs.log('Your player is ready!');

    // setup ui
    document.getElementById("play-button").onclick = function () {
        socket.send("play");
        this.play();
    }.bind(this);

    document.getElementById("pause-button").onclick = function () {
        socket.send("pause");
        this.pause();
    }.bind(this);

    document.getElementById("reset-button").onclick = function () {
        socket.send("reset");
        this.currentTime(0);
    }.bind(this);

    // player events
    this.on('play', function () {
        videojs.log('started playing...');
    });

    this.on('ended', function () {
        videojs.log('Awww...over so soon?!');
    });
});

// socket methods
socket.onopen = function(e) {
    socket.send("preview connected");
};

socket.onmessage = function(event) {
    let message = event.data;
    console.log(`[message] ${message}`);

    if(message === "play") {
        player.play();
        return;
    }

    if(message === "pause") {
        player.pause();
        return;
    }

    if(message === "reset") {
        player.currentTime(0);
        return;
    }

    // sync command
    if (message.startsWith("sync")) {
        let syncTime = parseFloat(message.split(" ")[1]);
        player.currentTime(syncTime);
        return;
    }
};

socket.onclose = function(event) {
    if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('[close] Connection died');
    }
};

socket.onerror = function(error) {
    console.log(`[error] ${error.message}`);
};