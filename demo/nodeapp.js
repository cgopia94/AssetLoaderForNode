var express = require('express'),
    app = express(),
    fs = require('fs'),
    port = parseInt(process.env.PORT, 10) || 8088;

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.redirect("/index.html");
});

app.get('/assets', function (req, res) {
  fs.readdir('public/' + req.query.p, function (err, files) {
    if (err) {
      res.status(500);
      res.send(err.message);
      console.log('File access error!');
    }
    else {
      res.status(200);
      res.send(files);
    }
  });
});

console.log("Simple static server listening at http://localhost:" + port);
var server = app.listen(port, function () {
});