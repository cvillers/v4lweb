var jazz = require("../node_modules/jazz");
var fs = require("fs");
var path = require("path");

var config = {};
var templates = {};

templatePath = "../templates";

exports.loadTemplates = function(_config) {
	config = _config;
}
