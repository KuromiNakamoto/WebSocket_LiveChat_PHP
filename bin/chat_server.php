<?php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

use ChatSocket\Chat;


require dirname(__DIR__) . '/vendor/autoload.php';
require dirname(__DIR__) . "/source/socket/Chat.php";

$server = IoServer::factory(
	new HttpServer(
		new WsServer(
			new Chat()
		)
	),
	8080
);

$server->run();