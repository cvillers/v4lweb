express = require("./node_modules/express");
jazz = require("./node_modules/jazz");
spawner = require("./lib/spawner");
fs = require("fs");
template = require("./lib/template");
util = require("util");

config = JSON.parse(fs.readFileSync('config.json').toString());

spawner.spawn(config);
template.loadTemplates(config);

// watch the config file
fs.watchFile('config.json', function(curr, prev) {
	config = JSON.parse(fs.readFileSync('./config.json').toString());
	
	// welp time to kill the old ones
	spawner.killAll();

	// then spawn the new ffmpeg processes
	spawner.spawn(config);
});

// This really isn't the most optimal way to define routes
// But seeing as we have so few it's not a big problem
var app = express.createServer();

require("./controllers")(app);
//app.get('/', controllers.page.index);
//app.get('/about', controllers.page.about);
//app.get('/static/:filename', controllers.static.index);

app.listen(config.port);
