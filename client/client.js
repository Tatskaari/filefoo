path = require('path'),
clip = require('copy-paste'),
http = require('http'), 
fs = require('fs');

var server = 'localhost';
var port = 8080;

var filePath = process.argv[2];

var filename = path.basename(filePath);
var username = 'jon';

var file = fs.readFileSync(filePath);
var data = new Buffer(file).toString('base64').replace(/ /g, '+');

var url = 'http://' + server + ':' + port + '/save?user=' + username + '&filename=' + filename + '&data=' + data;

console.log(url);

var req = http.get(url, function(res) {
  var bodyChunks = [];
  res.on('data', function(chunk) {
    bodyChunks.push(chunk);
  }).on('end', function() {
    var body = Buffer.concat(bodyChunks).toString();
    //console.log('BODY: ' + body);
    clip.copy(body);
    // ...and/or process the entire body here.
  })
});

req.on('error', function(e) {
  console.log('ERROR: ' + e.message);
});