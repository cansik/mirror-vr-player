let maxDelta = 0.25;

let options = {  };

// delta label
let deltaLabel = document.getElementById("delta-label");

// web socket
let socket = new WebSocket("ws://" + location.host + "/api/player/");

// player
let player = videojs('video', options, function onPlayerReady() {
    videojs.log('Your player is ready!');

    // setup ui
    document.getElementById("play-button").onclick = function () {
        socket.send("play");
        this.play();
    }.bind(this);

    document.getElementById("pause-button").onclick = function () {
        socket.send("pause");
        this.pause();

        // SEND Sync to other
        let timeCode = player.currentTime();
        socket.send(`sync ${timeCode} cold`);
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
        let tokens = message.split(" ");
        let syncTime = parseFloat(tokens[1]);
        let coldSync = tokens.length === 3;

        // start if is not played and is not cold sync
        if(!coldSync && player.paused()) {
            player.play();
        }

        let delta = syncTime - player.currentTime();
        deltaLabel.innerText = `Delta: ${Math.round((delta + Number.EPSILON) * 100) / 100}s`;

        if(Math.abs(delta) > maxDelta)
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