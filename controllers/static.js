var path = require("path");
var util = require("util");
var template = require("../lib/template");

var staticRoot = "../static";

module.exports = function(app) {

var regex = new RegExp("/static/([a-zA-Z0-9\.\-])");

app.get(regex, function(req, res) {
	var types = {
		"js" : "text/javascript",
	};
	
	var file = req.params[0];

        fs.stat(path.join(staticRoot, file), function(err, stats) {
                if(err != null) {
                        template.error404("File not found", req, res);
                        return;
                }
        });

        var ext = file.split('.')[1];

        if(!(ext in types))
        {
                template.error404("File not found", req, res);
                return;
        }

        res.writeHeader(200, types[ext]);
        contents = "";
        if(types[ext].indexOf("text") != -1)
        {
                fs.readFile(path.join(staticRoot, file), "ascii", function(err, data) {
			if(data != null) {
				util.log(data);
	                        res.write(data);
			}
                });
        }
        else
        {
                fs.readFile(path.join(staticRoot, file), function(err, data) {
			if(data != null) {
	                        res.write(data);
			}
                });
        }

	res.end();
});

};
