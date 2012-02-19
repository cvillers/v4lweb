module.exports = function(app, config) {
	require("./page")(app, config);
	require("./stream")(app, config);
};
