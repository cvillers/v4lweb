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

	fs.unlink(ffmPath, function(err) {
		
	});

	// write ffserver_port.conf
	var ctx = {
		"port": server.port,
		"tmpdir": dir,
		"streamName": server.name,
		"localRangeMin": config.localRange[0],
		"localRangeMax": config.localRange[1],
		"width": server.width,
		"height": server.height,
		"rate": server.rate,
		"include": function(filename, cb) {
			var conf = fs.readFileSync("./data/" + filename, "ascii");
			var subConf = jazz.compile(conf);
			subConf.eval(filename, cb);
		}
	}
	var renderedConf = "";
	masterConf.eval(ctx, function(data) {
		renderedConf += data.toString();
	});
	fs.writeFileSync(confPath, renderedConf);

	var ffserver = "ffserver";
	var ffmpeg = "ffmpeg";
	var ldPath = "";
	var env = process.env;
	
	// we may need a local ffmpeg
	if(config.useLocalFFmpeg) {
		ffserver = path.join(config.localFFmpegPath, "bin", "ffserver");
		ffmpeg = path.join(config.localFFmpegPath, "bin", "ffmpeg");
		env["LD_LIBRARY_PATH"] = path.join(config.localFFmpegPath, config.localFFmpegLib64 ? "lib64" : "lib");
	}

	// spawn ffserver and ffmpeg
	runningServers[server.port] = {
		ffserver: child_process.spawn(ffserver, ["-f", confPath], env),
		name: server.name,
		port: server.port
	};

	runningServers[server.port].ffmpeg = child_process.spawn(ffmpeg, ["-f", "video4linux2", "-i", server.device, "-r", server.rate, "-acodec", "none", "-s", server.width+"x"+server.height, "http://localhost:" + server.port.toString() + "/v4lweb_" + server.port.toString() + ".ffm"], env);

	runningServers[server.port].ffserver.stderr.on('data', function(data) {
		//util.log("ffserver " + server.port + " stderr: " + data);
	});

        runningServers[server.port].ffmpeg.stderr.on('data', function(data) {
                //util.log("ffmpeg " + server.port + " stderr: " + data);
        });

}

exports.killAll = function() {
	for(s in runningServers) {
		killServer(runningServers[s]);
	}
}

function killServer(server) {
	// kill ffserver
	//util.log(JSON.stringify(server));
	server.ffserver.kill();		// defaults to SIGTERM

	// kill ffmpeg
	server.ffmpeg.kill();

	// TODO maybe those should be reversed?
}

exports.findServer = function(name, format) {
	for(s in config.servers) {
		if(config.servers[s].name == name && config.servers[s].formats.indexOf(format) != -1)
			return config.servers[s];
	}

	return null;
}
