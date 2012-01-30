module.exports = function(app, config) {
	require("./page")(app, config);
	//require("./static")(app, config);
	require("./stream")(app, config);
};
