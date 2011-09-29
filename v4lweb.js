var express = require("./node_modules/express");
var jazz = require("./node_modules/jazz");
var spawner = require("./lib/spawner");
var fs = require("fs");

var config = JSON.parse(fs.readFileSync('config.json').toString());
spawner.spawn(config);

// watch the config file
fs.watchFile('config.json', function(curr, prev) {
	config = JSON.parse(fs.readFileSync('./config.json').toString());
	
	// welp time to kill the old ones
	spawner.killAll(config);

	// then spawn the new ffmpeg processes
	spawner.spawn(config);
});

