var spawner = require("../lib/spawner");

module.exports = function(app) {

function pageHandler(req, res) {
	page = "";

	if(typeof req.params.page == 'undefined')
		page = "home";
	else
		page = req.params.page;

	res.render(page, { title: config.pages[page].title, config: config, staticPageName: page });
}

app.get("/", pageHandler);
app.get("/:page", pageHandler);

};
