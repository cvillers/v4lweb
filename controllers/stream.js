var spawner = require("../lib/spawner");
var httpProxy = require("http-proxy");
var config = {};

module.exports = function(app, _config) {

config = _config;

app.get("/stream/view/:stream/:format", function(req, res) {
	var stream = req.params.stream;
	var server = spawner.findServer(stream, req.params.format);
	res.render("streamView", {
		title: "Viewing feed " + server.displayName,
		displayName: server.displayName,
		description: server.description,
		streamName: stream,
		streamPage: true,
		width: server.width,
		height: server.height
	});
});

app.get("/stream/data/:stream/:format", function(req, res) {
	var proxy = new httpProxy.RoutingProxy();

	var name = req.params.stream;
	var format = req.params.format;

	var server = spawner.findServer(name, format);

	req.url = name + "." + format;

	proxy.proxyRequest(req, res, {
		host: "localhost",
		port: server.port
	});
});

app.get("/stream/js/:stream", function(req, res) {
	var stream = req.params.stream;
	
	var server = spawner.findServer(stream, "flv");	// cheat here because js right now is only needed for the flv stream
	
	res.contentType("application/javascript");
	res.render("streamJS", { streamName: stream, width: server.width, height: server.height });
});

};

