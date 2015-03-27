var WebSocketServer = require('websocket').server;
var http = require('http');
var fork = require('child_process').spawn;
var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});
server.listen(10000, function() { });

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var child = fork('cmd', ['dir']); 
    connection.send("test\n");
	// use event hooks to provide a callback to execute when data are available: 
	child.stdout.on('data', function(data) {
	    connection.send(data.toString()); 
	});
	child.stderr.on('data',function(data){
		console.log(data.toString());
	})
	child.on('exit',function(code){
		connection.shutDown();
	})
    
});
