var spawner = require("../lib/spawner");

module.exports = function(app) {

function pageHandler(req, res) {
	page = "";

	if(typeof req.params.page == 'undefined')
		page = "home";
	else
		page = req.params.page;

	res.render(page, { title: config.pages[page].title, config: config, staticPageName: page });
	//res.end();
}

app.get("/", pageHandler);
app.get("/:page", pageHandler);


//app.get("/about", function(req, res) {
//	res.render("about", { title: "About", servers: config.servers });
//	//res.end();
//});

};
