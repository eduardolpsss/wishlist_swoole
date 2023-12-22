<?php

$server = new Swoole\Websocket\Server('127.0.0.1', 9501);

$server->on('open', function (Swoole\WebSocket\Server $server, Swoole\Http\Request $request) {
    echo "User {$request->fd} connected\n";
});

$server->on('message', function (Swoole\WebSocket\Server $server, Swoole\WebSocket\Frame $frame) {
    echo "User {$frame->fd} send message: {$frame->data}\n";

    foreach ($server->connections as $fd) {
        if ($frame->fd != $fd) {
            $server->push($fd, $frame->data);
        }
    }
});

$server->on('close', function (Swoole\WebSocket\Server $server, int $fd) {
    echo "User {$fd} disconnected\n";
});

$server->start();