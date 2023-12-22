<?php

// Create a Swoole WebSocket Server
$server = new Swoole\Websocket\Server('127.0.0.1', 9501);

// Event callback for when a WebSocket connection is established
$server->on('open', function (Swoole\WebSocket\Server $server, Swoole\Http\Request $request) {
    echo "User {$request->fd} connected\n";
});

// Event callback for when a WebSocket message is received
$server->on('message', function (Swoole\WebSocket\Server $server, Swoole\WebSocket\Frame $frame) {
    echo "User {$frame->fd} send message: {$frame->data}\n";

    foreach ($server->connections as $fd) {
        if ($frame->fd != $fd) {
            $server->push($fd, $frame->data);
        }
    }
});

// Event callback for when a WebSocket connection is closed
$server->on('close', function (Swoole\WebSocket\Server $server, int $fd) {
    echo "User {$fd} disconnected\n";
});

// Start the WebSocket server
$server->start();
