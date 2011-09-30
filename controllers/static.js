var path = require("path");
var template = require("../lib/template");

var staticRoot = "./static";

module.exports = function(app) {

app.get("/static/:filename", function(req, res) {
	var types = {
		"js" : "text/javascript",
	};
	
	var file = req.params.filename;

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
                        res.write(data);
                });
        }
        else
        {
                fs.readFile(path.join(staticRoot, file), function(err, data) {
                        res.write(data);
                });
        }
});

};
