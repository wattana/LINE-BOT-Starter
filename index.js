var express = require('express')
var app = express()
var path = require('path');
var bodyParser = require('body-parser');
// create application/json parser 
var jsonParser = bodyParser.json()
//app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var sqlite3 = require('sqlite3').verbose();
var DATABASE_NAME = "chat.db"
var db = new sqlite3.Database(DATABASE_NAME);
 
db.serialize(function() {
  //db.run("drop TABLE if exists messages")
  db.run("CREATE TABLE if not exists messages (replyToken TEXT, eventType TEXT,timestamp TEXT,sourceType TEXT,sourceUserId TEXT, messageId TEXT, messageType TEXT, messageText TEXT,info TEXT)");
 
 /*
  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();
  */
 
  db.each("SELECT rowid AS id, replyToken, eventType, timestamp ,sourceType ,sourceUserId , messageId , messageType , messageText ,info FROM messages", function(err, row) {
      console.log(row.id + ": " , row.replyToken, row.eventType, row.timestamp ,row.sourceType ,row.sourceUserId , row.messageId , row.messageType , row.messageText,row.info);
  });
  
});
 
db.close();

app.use('/classic',express.static('classic'))
app.use('/modern',express.static('modern'))
app.use('/resources',express.static('resources'))

app.get("/", function (req, res) {
  //res.send('Hello World!')
  res.sendFile(path.join(__dirname + '/index.html'));
})
app.get("/index.html", function (req, res) {
  //res.send('Hello World!')
  res.sendFile(path.join(__dirname + '/index.html'));
})
app.get('/cache.appcache', function (req, res) {
  res.sendFile(path.join(__dirname + '/cache.appcache'));
})
app.get('/classic.json', function (req, res) {
  res.sendFile(path.join(__dirname + '/classic.json'));
})

app.post('/message', jsonParser,function (req, res) {
    /*
    db.run("CREATE TABLE if not exists messages (
     replyToken TEXT,
     eventType TEXT,
     timestamp TEXT,
     sourceType TEXT,
     sourceUserId TEXT, 
     messageId TEXT, 
     messageType TEXT, 
     messageText TEXT,
     info TEXT)");
     */
    var db = new sqlite3.Database(DATABASE_NAME);
    db.serialize(function() {
      var stmt = db.prepare("INSERT INTO messages VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
      for (var i=0; i<req.body.events.length; i++) {
        var data = req.body.events[i];
        var messageId = ""
        var messageType =""
        var messageText ="" 
        if (data.message) {
            messageId = data.message.id
            messageType = data.message.type
            messageText = data.message.text
        }
        console.log("INSERT INTO messages ",
                  [data.replyToken, data.type, 
                  data.timestamp,data.source.type,data.source.userId,
                  messageId, messageType, messageText]);
        stmt.run([data.replyToken, data.type, 
                  data.timestamp,data.source.type,data.source.userId,
                  messageId, messageType, messageText,
                  JSON.stringify(data)],
          function(err) {
            if (err) console.log("err",err)
        });
      }
      stmt.finalize();

    });
    db.close();
    //console.log("message body ",JSON.stringify(req.body));
    res.send('Message success\n')
})

app.get('/listMessage',function (req, res) {
  var db = new sqlite3.Database(DATABASE_NAME);
  var messages = [];
  db.all("SELECT rowid AS id, replyToken, eventType, timestamp ,sourceType ,sourceUserId , messageId , messageType , messageText ,info FROM messages", function(err, rows) {
      /*
      console.log(row.id + ": " , row.replyToken, row.eventType, row.timestamp ,
      row.sourceType ,row.sourceUserId , row.messageId , row.messageType , 
      row.messageText,row.info);
      */
      for (var i=0; i<rows.length; i++) {
        var row = rows[i]
        messages.push({
          id : row.id,
          replyToken: row.replyToken,
          eventType : row.eventType,
          timestamp : row.timestamp ,
          sourceType : row.sourceType ,
          sourceUserId : row.sourceUserId ,
          messageId : row.messageId ,
          messageType: row.messageType , 
          messageText: row.messageText,
          info: row.info
        })
      }
      console.log(messages)
      res.json(messages);

  });
  //console.log('WWWWW',messages)
  db.close();
});


app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port : ',process.env.PORT || 3000)
})

/*
var http = require('http');

http.createServer(function(request, response) {
  console.log('Node app is running on port', process.env.PORT || 3000);
  if (request.method === 'GET' && request.url === '/echo') {
    var body = [];
    request.on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(body).toString();
      response.end("Data is :"+body);
    })
  } else {
    response.end("Hello world ");
  }
}).listen(process.env.PORT || 3000);
*/