var fs = require("fs");
var util = require("util");
var child_process = require("child_process");
var path = require("path");
var jazz = require("../node_modules/jazz");

var dir = "";
var masterConf = null;
var config = {};

var runningServers = [];

// FIXME maybe this is bad to take the global config as an object?
exports.spawn = function(_config) {
	config = _config;

	dir = config["tmp"];

	var master = fs.readFileSync("./data/ffserver.conf.jazz", "ascii");
	masterConf = jazz.compile(master);
	
	for(server in config["servers"]) {
		util.log(JSON.stringify(config));
		util.log(JSON.stringify(server));
		if(server["remote"] == null)
			spawnServer(server);
	}
}

function spawnServer(server) {
	var ffmPath = path.join(dir, "v4lweb_" + server["port"] + ".ffm");
	var confPath = path.join(dir, "ffserver_" + server["port"] + ".conf");
	
	// write ffserver_port.conf
	var ctx = {
		"port": server.port,
		"tmpdir": dir,
		"streamName": server.name,
		"localRangeMin": config.localRange[0],
		"localRangeMax": config.localRange[1]
	}
	var renderedConf = "";
	masterConf.eval(ctx, function(data) {
		renderedConf += data.toString();
	});
	fs.writeFileSync(confPath, renderedConf);

	// spawn ffserver	
	
	// spawn ffmpeg
}

exports.killAll = function() {
	for(s in runningServers) {
		killServer(s);
	}
}

function killServer(port) {
	// kill ffmpeg

	// kill ffserver
}
