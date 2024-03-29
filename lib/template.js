var jazz = require("../node_modules/jazz");
var fs = require("fs");
var path = require("path");
var url = require("url");

var config = {};
var templates = {};

templateRoot = "./templates";

exports.loadTemplates = function(_config) {
	config = _config;

    var files = fs.readdirSync(templateRoot);       // ok to do this sync because it's part of startup
    files.forEach(function (name) {
		if(/\.jazz$/.test(name)) {
			util.log("compiling " + name);
			var keyName = name.split('.')[0];
			templates[keyName] = jazz.compile(fs.readFileSync(templateRoot + '/' + name, 'ascii'));
			}
	});
}

exports.render = function(name, context, res) {
	context["include"] = function(filename, cb) {
		templates[filename].eval(filename, cb);
	}
	templates[name].eval(context, function(data) {
		res.write(data.toString());
	});
}

