var http = require('http')
, fs = require('fs')
, url = require('url')
, path = require('path')
, mime = require('mime');

var port = 8080;

http.createServer(function(request, response) {  
	var urlParts = url.parse(request.url, true);
	var query = urlParts.query;
	var resourcePath = getPathName(urlParts);

	try {
		console.log('new request: ' + resourcePath);
		handleRequest();
	} catch (err) {
		console.log('error: ' + xserr);
		respond(500, 'Server Error: ' + err);
	}

	function handleRequest(){
		if (resourcePath == "/save") {
			console.log('saving');
			//save the data
			if (query["data"]) {
				var username = query["user"];
				var filename = query["filename"];
				var dataParam = query["data"];
				saveFileForUser(username, filename, dataParam);

				respond(200, request.headers.host + "/fetch?user=" + username + "&filename=" + filename);
			}
			else {
				respond(404, "404 - Not found");
			}
			
		}
		else if (resourcePath = "/fetch") {
			var username = query["user"];
			var filename = query["filename"];

			respondWithFile(200, './' + username + '/' + filename);
		}
		else {
			respond(200, resourcePath);
		}
	}

	function respond(status, responseText){
		response.writeHeader(status, {'Content-Type': 'text/html'});   
	    response.write(responseText);
        response.end(); 
	}

	function respondWithFile(status, filePath){
	    var stat = fs.statSync(filePath);
	    var mimeType = mime.lookup(filePath);

	    response.writeHead(200, {
	        'Content-Type': mimeType,
	        'Content-Length': stat.size
	    });

	    var readStream = fs.createReadStream(filePath);
	    // We replaced all the event handlers with a simple call to readStream.pipe()
	    readStream.pipe(response);
	}

	function getPathName(urlParts){
		resourcePath = urlParts.pathname;
		return resourcePath;
	}

	function decodeBase64Image(dataString) {
		var dataBuffer = {};

		// Replace spaces for good measure
		dataBuffer.data = new Buffer(dataString.replace(/ /g, '+'), 'base64');

		return dataBuffer;
	}

	function saveFile(dataParam, filePath){
		var imageBuffer = decodeBase64Image(dataParam);

		fs.writeFile(filePath, imageBuffer.data, 'base64', function(err) { 
			if (err) {
		  		throw err;
		  	}; 
		 });
	}

	function saveFileForUser(username, filename, dataParam) {
		console.log('Saving file for user');

		if (!fs.existsSync('./' + username)) {
            fs.mkdirSync('./' + username, 0744);
        }
		saveFile(dataParam, './' + username + '/' + filename);
	} 
}).listen(port);
