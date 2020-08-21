// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function(){
  if (!exists) {
    db.run('CREATE TABLE Emojis (emojiId TEXT, top INT, left INT, emoji TEXT)');
    console.log('New table Emojis created!');
  }
  else {
    console.log('Database "Emojis" ready to go!');
    db.each('SELECT * from Emojis', function(err, row) {
      if ( row ) {
        console.log('record:', row);
      }
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/emojis', function(req, res) {
  db.all('SELECT * from Emojis', function(err, rows) {
    res.send(JSON.stringify(rows));
  });
});

app.get('/new', function(req, res) {
  var emojiId = req.query.emojiId;
  var top = req.query.top;
  var left = req.query.left;
  var emoji = req.query.emoji;
  
  db.serialize(function() {
    db.run('INSERT INTO Emojis (emojiId, top, left, emoji) VALUES ("' + emojiId +'", ' + top +', ' + left +', "' + emoji +'")');
  });
  res.status(200);
  res.json({status: "OK"});
});

app.get('/move', function(req, res) {
  var emojiId = req.query.emojiId;
  var top = req.query.top;
  var left = req.query.left;
  db.serialize(function() {
    db.run('UPDATE Emojis SET top = ' + top + ', left = ' + left + ' WHERE emojiId = "' + emojiId + '"');
  });
  console.log("MOVED - Id: " + emojiId + ", Top: " + top + ", Left: " + left); 
  res.status(200);
  res.json({status: "OK"});
});

app.get('/delete', function(req, res) {
  var emojiId = req.query.emojiId;
  db.serialize(function() {
    db.run('DELETE FROM Emojis WHERE emojiId = "' + emojiId + '";');
  });
  console.log("Deleted: " + emojiId);
  res.status(200);
  res.json({status: "Deleted"});
});
        
//DELETE FROM employees
//WHERE last_name = 'Smith';

app.get('/z', function(req, res) {
  console.log("MOVING!");
  res.status(200);
  res.json({status: "OK"});
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
