var spawner = require("../lib/spawner");

module.exports = function(app) {

app.get("/:page", function(req, res) {
	res.render(req.params.page, { title: config.pages[req.params.page].title, servers: config.servers });
	//res.end();
});

//app.get("/about", function(req, res) {
//	res.render("about", { title: "About", servers: config.servers });
//	//res.end();
//});

};
