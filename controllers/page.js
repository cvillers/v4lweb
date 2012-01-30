var template = require("../lib/template");

module.exports = function(app) {

app.get("/", function(req, res) {
	template.render("index", {"title":"Index"}, res);
	res.end();
});

app.get("/about", function(req, res) {
	template.render("about", {"title":"About"}, res);
	res.end();
});

};
