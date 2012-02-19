express = require("./node_modules/express");
jazz = require("./node_modules/jazz");
spawner = require("./lib/spawner");
fs = require("fs");
util = require("util");
var path = require("path");

config = JSON.parse(fs.readFileSync('config.json').toString());

function checkTmpPath() {
	exists = path.existsSync(config.tmp);

	if(!exists) {
		util.log("creating " + config.tmp);
		fs.mkdirSync(config.tmp, 0744);
	}
}

checkTmpPath();

spawner.spawn(config);

// watch the config file
fs.watchFile('config.json', function(curr, prev) {
	config = JSON.parse(fs.readFileSync('config.json').toString());
	checkTmpPath();

	// time to kill the old ones
	spawner.killAll();

	// then spawn the new ffmpeg processes
	spawner.spawn(config);
});

process.on("exit", function () {
	util.log("killing all");
	spawner.killAll();
});

var app = express.createServer();

app.set("view engine", "ejs");
app.set("view options", { layout: false });
require("./controllers")(app, config);

app.configure(function() {

	app.use(express.favicon());
	app.use(express.logger("\":method :url\" :status"));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	app.use("/static", express.static(__dirname + "/static"));

	app.use(app.router);

});

app.listen(config.port);
