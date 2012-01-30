//var template = require("../lib/template");
var spawner = require("../lib/spawner");
var httpProxy = require("http-proxy");
var config = {};

module.exports = function(app, _config) {

config = _config;

app.get("/stream/view/:stream/:format", function(req, res) {
	var stream = req.params.stream;
        //template.render("streamView", {"title":"View " + stream, "streamName": stream, "streamPage": true}, res);
	res.render("streamView", { title: "View " + stream, streamName: stream, streamPage: true });
	//res.end();
});

app.get("/stream/data/:stream/:format", function(req, res) {
	util.log("in /stream/data/" + req.params.stream);

	var proxy = new httpProxy.RoutingProxy();
	//var stream = req.params.stream;
	//var server = {};

	// FIXME this is bad
	//for(s in config.servers) {
	//	if(config.servers[s].name == stream)	// WTF
	//		server = config.servers[s];
	//}

	var name = req.params.stream;
	var format = req.params.format;

	//util.log("name: " + name + " format: " + format);

	var server = spawner.findServer(name, format);

	//util.log(JSON.stringify(server));
	//util.log("going to proxy request to localhost:" + server.port);

	//util.log(JSON.stringify(req));

	req.url = name + "." + format;

	proxy.proxyRequest(req, res, {
		host: "localhost",
		port: server.port
	});
});

app.get("/stream/js/:stream", function(req, res) {
	var stream = req.params.stream;
	//template.render("streamJS", {"streamName":stream}, res);
	
	var server = spawner.findServer(stream, "flv");	// js right now is only needed for the flv stream
	
	res.contentType("application/javascript");
	res.render("streamJS", { streamName: stream, width: server.width, height: server.height });
	//res.end();
});

};

