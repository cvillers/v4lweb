var http = require('http');
var util = require('util');

var server = http.createServer(function(req, res) {
	util.log(JSON.stringify(req.headers));
});

server.listen(4504);
