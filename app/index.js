"use strict";

process.title = 'node-mirror-vr';

let webSocketsServerPort = 1337;
let webSocketServer = require('websocket').server;
let http = require('http');


let finalhandler = require('finalhandler');
let serveStatic = require('serve-static');

let serve = serveStatic("./dist/");


// list of currently connected clients
let clients = [];

// HTTP server
const server = http.createServer(function (request, response) {
    let done = finalhandler(request, response);
    serve(request, response, done);
});

server.listen(webSocketsServerPort, function () {
    console.log((new Date()) + " Server is listening on port "
        + webSocketsServerPort);
});

// WebSocket server
const wsServer = new webSocketServer({
    httpServer: server
});


wsServer.on('request', function (request) {
    console.log((new Date()) + ' Connection from origin '
        + request.origin + '.');

    let connection = request.accept(null, request.origin);
    let index = clients.push(connection) - 1;

    // user sent some message
    connection.on('message', function (message) {
        if (message.type === 'utf8') { // accept only text
            console.log((new Date()) + ' Received Message from ' + message.utf8Data);

            // broadcast message to all connected clients
            for (let i = 0; i < clients.length; i++) {
                if(i !== index)
                    clients[i].sendUTF(message.utf8Data);
            }
        }
    });
    // user disconnected
    connection.on('close', function (connection) {
        console.log((new Date()) + " Peer "
            + connection.remoteAddress + " disconnected.");
        clients.splice(index, 1);
    });
});