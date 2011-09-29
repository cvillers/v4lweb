var staticRoot = "../static";

module.exports = function(app) {

app.get("/static/:filename", function(req, res) {
	var types = {
		"js" : "text/javascript",
	};
	
	var file = req.params.filename;

        fs.stat(path.join(staticRoot, file), function(err, stats) {
                if(err != null) {
                        util.log(JSON.stringify(err));
                        util.log("calling do404");
                        do404(req, res);
                        util.log("called do404, returning");
                        return;
                }
        });

        var ext = file.split('.')[1];

        if(!(ext in types))
        {
                do404(req, res);
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
