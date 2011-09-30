var fs = require("fs");
var util = require("util");
var child_process = require("child_process");
var path = require("path");
var jazz = require("../node_modules/jazz");

var dir = "";
var masterConf = null;
var config = {};

var runningServers = {};

// FIXME maybe this is bad to take the global config as an object?
exports.spawn = function(_config) {
	config = _config;

	dir = config["tmp"];

	var master = fs.readFileSync("./data/ffserver.conf.jazz", "ascii");
	masterConf = jazz.compile(master);
	
	for(server in config.servers) {		// WTF
		//util.log(JSON.stringify(config));
		//util.log(JSON.stringify(config.servers[server]));
		if(config.servers[server].type == "local")
			spawnServer(config.servers[server]);
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

	// spawn ffserver and ffmpeg
	//util.log(JSON.stringify(config));
	runningServers[server.port] = {
		ffserver: child_process.spawn("ffserver", ["-f", confPath]),
		//ffmpeg: child_process.spawn("ffmpeg", ["-f", "video4linux2", "-i", server.device, "-r", "30", "-acodec", "none", "http://localhost:" + config.port.toString() + "/v4lweb_" + server.port.toString() + ".ffm"]),
		name: server.name,
		port: server.port
	};

	runningServers[server.port].ffmpeg = child_process.spawn("ffmpeg", ["-f", "video4linux2", "-i", server.device, "-r", "30", "-acodec", "none", "-s", "640x480", "http://localhost:" + server.port.toString() + "/v4lweb_" + server.port.toString() + ".ffm"]);

	runningServers[server.port].ffserver.stderr.on('data', function(data) {
		util.log("ffserver " + server.port + " stderr: " + data);
	});

        runningServers[server.port].ffmpeg.stderr.on('data', function(data) {
                util.log("ffmpeg " + server.port + " stderr: " + data);
        });

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
