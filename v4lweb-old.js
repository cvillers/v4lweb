var	http = require('http'), 
	url = require('url'),
	fs = require('fs'),
	jazz = require('./node_modules/jazz'),
	util = require('util');

var config = JSON.parse(fs.readFileSync('config.json').toString());

var templateRoot = './templates';

// watch the config file
fs.watchFile('config.json', function(curr, prev) {
	config = JSON.parse(fs.readFileSync('./config.json').toString());

	// then spawn the new ffmpeg processes
});

templates = {};

function compileTemplates(root) {
	var files = fs.readdirSync(root);	// ok to do this sync because it's part of startup
	try {
		files.forEach(function (name) {
			if(/\.jazz$/.test(name)) {
				var keyName = name.split('.')[0];
				templates[keyName] = jazz.compile(fs.readFileSync(templateRoot + '/' + name, 'ascii'));
			}
		});
	} catch(e) {
		util.log("Error in template");
		util.log(e.stack);
	}
	//util.log(JSON.stringify(templates));
}

function doTemplate(name, ctx, res) {
	ctx["include"] = function(filename, cb) {
		//util.log("going to eval " + filename);
		templates[filename].eval(ctx, cb);
	}
	//util.log(JSON.stringify(ctx));
	//util.log(JSON.stringify(templates[name]));
	templates[name].eval(ctx, function(data) { res.write(data.toString()); });
}

compileTemplates(templateRoot);

function do404(req, res) {
        var ctx = {
                url : url.parse(req.url).pathname,
                title : "Page not found"
        };
	util.log("in do404, sending header");
        res.writeHeader(404, 'text/html');
	util.log("in do404, sending template");
        //res.write('Sorry, that URL could not be found.');
	doTemplate("404", ctx, res);
}

function doMainPage(req, res) {
	var ctx = {
		"title" : "v4lweb"
	};
	res.writeHeader(200, 'text/html');
	doTemplate("index", ctx, res);
}

function doStatic(req, res, file) {
	var types = {
		"js": "text/javascript",
	};

	fs.stat("static/" + file, function(err, stats) {
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
		fs.readFile("static/" + file, "ascii", function(err, data) {
			req.write(data);
		});
	}
	else
	{
		fs.readFile("static/" + file, function(err, data) {
			req.write(data);
		});
	}
}


function doStream(req, res, streamName) {
}

function do404(req, res) {
	var ctx = {
		url : url.parse(req.url).pathname,
		title : "Page not found"
	};
	res.writeHeader(404, 'text/html');
	//res.write('Sorry, that URL could not be found.');
	doTemplate("404", ctx, res);
}

http.createServer(function(req, res) {
	var getPathComponents = function() {
		var pathname = url.parse(req.url).pathname;
		var components = pathname.split('/');
		if(pathname.length > 1 && pathname[0] == '/')
			var temp = components.shift();
		return components;
	};
	
	var path = getPathComponents();

	switch(path[0])
	{
		case "":	// FIXME this is the / url
		{
			doMainPage(req, res);
			break;
		}
		case "static":
		{
			doStatic(req, res, path[1]);
			break;
		}
		case "stream":
		{
			doStream(req, res, path[1]);
			break;
		}
		default:
		{
			do404(req, res);
			break;
		}
	}

	res.end();
}).listen(4502);	// 4502-4534 unassigned per IANA

