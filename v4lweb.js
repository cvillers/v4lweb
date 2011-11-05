express = require("./node_modules/express");
jazz = require("./node_modules/jazz");
spawner = require("./lib/spawner");
fs = require("fs");
template = require("./lib/template");
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
template.loadTemplates(config);

// watch the config file
fs.watchFile('config.json', function(curr, prev) {
	config = JSON.parse(fs.readFileSync('./config.json').toString());
	checkTmpPath();

	// welp time to kill the old ones
	spawner.killAll();

	// then spawn the new ffmpeg processes
	spawner.spawn(config);
});

process.on("exit", function () {
	util.log("killing all");
	spawner.killAll();
});

// This really isn't the most optimal way to define routes
// But seeing as we have so few it's not a big problem
var app = express.createServer();

require("./controllers")(app, config);

app.use(express.favicon());
app.use(express.logger("\":method :url\" :status"));
app.use(app.router);
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
// 404
//app.use(function(req, res, next) {
//	template.error404("Page not found", req, res);
//});

app.listen(config.port);
