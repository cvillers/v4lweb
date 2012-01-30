//var template = require("../lib/template");

module.exports = function(app) {

app.get("/", function(req, res) {
	//template.render("index", {"title":"Index"}, res);
	//res.write("test");
	res.render("index", { title : "Index" });
	//res.end();
});

app.get("/about", function(req, res) {
	res.render("about", {title:"About"});
	//res.end();
});

};
