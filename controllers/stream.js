//var template = require("../lib/template");
var httpProxy = require("http-proxy");
var config = {};

module.exports = function(app, _config) {

config = _config;

app.get("/stream/view/:stream", function(req, res) {
	var stream = req.params.stream;
        //template.render("streamView", {"title":"View " + stream, "streamName": stream, "streamPage": true}, res);
	res.render("streamView", { title: "View " + stream, streamName: stream, streamPage: true });
	res.end();
});

app.get("/stream/data/:stream", function(req, res) {
	var proxy = new httpProxy.RoutingProxy();
	var stream = req.params.stream;
	var server = {};
	// FIXME this is bad
	for(s in config.servers) {
		if(config.servers[s].name == stream)	// WTF
			server = config.servers[s];
	}
	proxy.proxyRequest(req, res, {
		host: "localhost",
		port: server.port
	});
});

// TODO /stream/js/:stream to generate flowplayer embed code for each stream

app.get("/stream/js/:stream", function(req, res) {
	var stream = req.params.stream;
	//template.render("streamJS", {"streamName":stream}, res);
	res.render("streamJS", { streamName: stream });
	res.end()
});

};

