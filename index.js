var express = require('express')
var app = express()
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
// create application/json parser 
var jsonParser = bodyParser.json()
//app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var async = require('async');

var Client = require('node-rest-client').Client;
var client = new Client();
var token = 'Bearer {MVJYNb3LtA+efs7m5jbcxhIEeuMekIwto3kLBtF6qUwpykvpvSqqJSKFuHzDJf5tKklfG+BFSx0zuEAG0zFv8IU+tM8tOTUG0uU0Q3lJ/xWg3shdp/wUnph+j+tvIHRfE1zac0+dCe1tFNFbztgKqQdB04t89/1O/w1cDnyilFU=}'
var sqlite3 = require('sqlite3').verbose();
var DATABASE_NAME = "chat.db"
var db = new sqlite3.Database(DATABASE_NAME);
 
db.serialize(function() {
  var drop = true;
  if (drop) {
    db.run("drop TABLE if exists messages")
    db.run("drop TABLE if exists chat_room")
  }
  db.run("CREATE TABLE if not exists messages "+
        "(roomId INTEGER, replyToken TEXT, eventType TEXT,timestamp TEXT,sourceType TEXT,sourceUserId TEXT, "+
        "messageId TEXT, messageType TEXT, messageText TEXT,info TEXT)");

  db.run("CREATE TABLE if not exists chat_room "+
        "(userId TEXT, "+
        "displayName TEXT, "+
        "pictureUrl TEXT, "+
        "statusMessage TEXT,"+
        "message TEXT,"+
        'createtime TEXT,'+
        'updatetime TEXT,'+
        "active INTEGER)");
 
 /*
  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();
  db.prepare("INSERT INTO chat_room "+
                            "(userId ,displayName, pictureUrl, statusMessage, active) "+
                            "VALUES(?, ?, ?, ?, ?)")
                    .run(["userId","","","",1])
                    .finalize();
  */

 
  db.each("SELECT rowid AS id, replyToken, eventType, timestamp ,sourceType ,sourceUserId , messageId , messageType , messageText ,info FROM messages", function(err, row) {
      console.log(row.id + ": " , row.replyToken, row.eventType, row.timestamp ,row.sourceType ,row.sourceUserId , row.messageId , row.messageType , row.messageText,row.info);
  });
  
});
 
db.close();

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('news', { hello: 'world' });
  socket.on('pushMessage', onPushMessage);
});

function onPushMessage (data) {
  //var message = '{"to": +'+data.sourceUserId+',"messages":[{"type":"text","text":'+data.message.text+'}]}'
  //console.log(data, message)
  var args = {
    headers: { 
        "Authorization": token,
        "Content-Type": "application/json" 
      }, // request headers 
      data : {
        "to": data.sourceUserId,
          "messages":[{
            "type":"text",
            "text":data.message.text
          }]
      }
  };
  client.post("https://api.line.me/v2/bot/message/push", args, 
  function (result, response) {
    // parsed response body as js object 
    console.log('result',result);
    // raw response 
    //console.log(response);
    updateRoom({id : data.roomId},data)
  });
}

app.use('/classic',express.static('classic'))
app.use('/modern',express.static('modern'))
app.use('/resources',express.static('resources'))

// allow CORS
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

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

app.get('/pushMessage', function (req, res) {
  var message = '{"to": "Uaa89e07dfe96f3b66fe7937cf9e2c591","messages":[{"type":"text","text":"Quatation แก้ไข incident จากเดิม 100 ข้อเป็น 150 ข้อ คิดราคา 50,000 บาทตามที่คุยกันไว้ครับ"}]}'
  var args = {
      headers: { 
        "Authorization": token,
        "Content-Type": "application/json" 
      }, // request headers 
      data :   {"to": "Uaa89e07dfe96f3b66fe7937cf9e2c591",
                "messages":[{"type":"text",
                "text":"Quatation แก้ไข incident จากเดิม 100 ข้อเป็น 150 ข้อ คิดราคา 50,000 บาทตามที่คุยกันไว้ครับ"}
                ]}

  };
  client.post("https://api.line.me/v2/bot/message/push", args, 
  function (result, response) {
    // parsed response body as js object 
    console.log('result',result);
    // raw response 
    //console.log(response);
    res.send(result)
  });
})

app.post('/message', jsonParser,function (req, res) {
    var db = new sqlite3.Database(DATABASE_NAME);
    for (var i=0; i<req.body.events.length; i++) {
        var data = req.body.events[i];
        if (data.type == 'message') {
            if (data.message.text == 'สอบถาม'||data.message.text == 'menu') {
              replyMessage(data);
            }
            var exists = true;
            var messageEv = data;
            db.get("SELECT rowid AS id, * FROM chat_room where userId = ? and active=1 LIMIT 1", [messageEv.source.userId],
            function(err, row){
              if(err) throw err;
              var room = {};
              if(typeof row == "undefined") {
                  exists = false;
              } else {
                  room = row
                  console.log("row is: ", row);
              }
              console.log("## Is not exists",exists)
              if (exists) {
                updateRoom(room, messageEv);
              } else {
                createRoom(room, messageEv);
              }       
            });
        } else {
            var stmt = db.prepare("INSERT INTO messages "+
              "(replyToken ,eventType ,timestamp ,sourceType ,sourceUserId ,info) "+ 
              "VALUES (?, ?, ?, ?, ?, ?)");
            console.log("INSERT INTO messages ",
                      [data.replyToken, data.type, 
                      data.timestamp,data.source.type,data.source.userId]);
            stmt.run([data.replyToken, data.type, 
                      data.timestamp, data.source.type, data.source.userId,
                      JSON.stringify(data)],
              function(err) {
                if (err) console.log("err",err)
            });
            stmt.finalize();
        }
    }
    db.close();
    //console.log("message body ",JSON.stringify(req.body));
    res.send('Message success\n')
})

app.get('/listMessage',function (req, res) {
  //console.log(req)
  var db = new sqlite3.Database(DATABASE_NAME);
  var messages = [];
  db.all("SELECT messages.rowid AS id, roomId, replyToken, eventType, timestamp ,sourceType, "+
         "sourceUserId , messageId , messageType , messageText ,info "+
         "FROM messages , chat_room "+
         "where messages.sourceUserId = chat_room.userId "+
         "and chat_room.rowid = ? and eventType='message'",[req.query.roomId], 
    function(err, rows) {
      console.log(rows)
      /*
      console.log(row.id + ": " , row.replyToken, row.eventType, row.timestamp ,
      row.sourceType ,row.sourceUserId , row.messageId , row.messageType , 
      row.messageText,row.info);
      */
      for (var i=0; i<rows.length; i++) {
        var row = rows[i]
        messages.push({
          id : row.id,
          roomId : row.roomId,
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
      //console.log(messages)
      res.json(messages);

  });
  //console.log('WWWWW',messages)
  db.close();
});

app.get('/listRoom',function (req, res) {
  //console.log(req)
  var db = new sqlite3.Database(DATABASE_NAME);
  var messages = [];
  db.all("SELECT rowid AS id, userId ,displayName, pictureUrl, statusMessage, message ,createtime, updatetime, active FROM chat_room", function(err, rows) {
      /*
      console.log(row.id + ": " , row.replyToken, row.eventType, row.timestamp ,
      row.sourceType ,row.sourceUserId , row.messageId , row.messageType , 
      row.messageText,row.info);
      */
      for (var i=0; i<rows.length; i++) {
        var row = rows[i]
        messages.push({
          id : row.id,
          userId: row.userId,
          displayName : row.displayName,
          pictureUrl : row.pictureUrl ,
          statusMessage : row.statusMessage ,
          message : row.message ,
          createtime : row.createtime ,
          updatetime : row.updatetime ,
          active : row.active
        })
      }
      //console.log(messages)
      res.json(messages);

  });
  //console.log('WWWWW',messages)
  db.close();
});

/*
app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port : ',process.env.PORT || 3000)
})
*/
http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});


function createRoom(room, messageEv) {
  var args = {
      headers: { "Authorization": token } // request headers 
  };
  client.get("https://api.line.me/v2/bot/profile/"+messageEv.source.userId, args, 
  function (result, response) {
      // parsed response body as js object 
      console.log(result);
      // raw response 
      //console.log(response);
      var db = new sqlite3.Database(DATABASE_NAME);
      db.serialize(function() {
        async.series([
          function (callback) {
            db.run("INSERT INTO chat_room "+
              "(userId ,displayName, pictureUrl, statusMessage, active) "+
              "select ?, ?, ?, ?, ? WHERE NOT EXISTS(SELECT 1 FROM chat_room WHERE userId = ? and active=1)",
            [messageEv.source.userId, "", "", "" , 1, messageEv.source.userId],
            function () {
              room.id = this.lastID;
              console.log("lastID",this.lastID)
              callback();
            })
          },
          function (callback) {
            console.log("INSERT INTO chat_room", [room.id,messageEv.source.userId,"","","",1]);
            db.run("update chat_room set "+
                  "displayName = ?"+
                  ",pictureUrl = ?"+
                  ",statusMessage = ? "+
                  ",message = ? "+
                  ",createtime = ? "+
                  "WHERE userId = ? and active=1",
            [result.displayName, result.pictureUrl,
            result.statusMessage ,messageEv.message.text, messageEv.timestamp, messageEv.source.userId])
            console.log("Update chat_room", [result.displayName, result.pictureUrl,result.statusMessage ,messageEv.source.userId]);
            io.emit('newroom', {
                id : room.id,
                userId: messageEv.source.userId,
                sourceUserId: messageEv.source.userId,
                displayName : result.displayName,
                pictureUrl : result.pictureUrl ,
                statusMessage : result.statusMessage ,
                message : messageEv.message.text ,
                createtime : messageEv.timestamp ,
                updatetime : null ,
                active : 1
            });
            console.log("INSERT INTO messages ",
                      [room.id, messageEv.replyToken, messageEv.type, 
                      messageEv.timestamp,messageEv.source.type,messageEv.source.userId,
                      messageEv.message.id, messageEv.message.type, messageEv.message.text]);
            var stmt = db.prepare("INSERT INTO messages "+
              "(roomId ,replyToken ,eventType ,timestamp ,sourceType ,"+
              "sourceUserId , messageId ,messageType , messageText ,info) "+ 
              "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            stmt.run([room.id, messageEv.replyToken, messageEv.type, 
                      messageEv.timestamp,messageEv.source.type,messageEv.source.userId,
                      messageEv.message.id, messageEv.message.type, messageEv.message.text,
                      JSON.stringify(messageEv)],
              function(err) {
                if (err) console.log("err",err)
            });
            stmt.finalize();
            callback();
          }
        ])
      }, function(err) { //This function gets called after the two tasks have called their "task callbacks"
        db.close();
        if (err) return next(err);
        //Here locals will be populated with `user` and `posts`
        //Just like in the previous example
      })
    })
}

function updateRoom(room, messageEv) {
    console.log("Update chat_room", [messageEv.message.text, messageEv.timestamp, messageEv.source.userId]);
    var db = new sqlite3.Database(DATABASE_NAME);
    db.serialize(function() {
      db.run("update chat_room set "+
            "message = ? "+
            ",updatetime = ? "+
            "WHERE userId = ? and active=1",
      [messageEv.message.text, messageEv.timestamp, messageEv.source.userId]);
      var stmt = db.prepare("INSERT INTO messages "+
        "(roomId ,replyToken ,eventType ,timestamp ,sourceType ,"+
        "sourceUserId , messageId ,messageType , messageText ,info) "+ 
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
      console.log("INSERT INTO messages ",
                [room.id, messageEv.replyToken, messageEv.type, 
                messageEv.timestamp,messageEv.source.type,messageEv.source.userId,
                messageEv.message.id, messageEv.message.type, messageEv.message.text]);
      stmt.run([room.id, messageEv.replyToken, messageEv.type, 
                messageEv.timestamp,messageEv.source.type,messageEv.source.userId,
                messageEv.message.id, messageEv.message.type, messageEv.message.text,
                JSON.stringify(messageEv)],
        function(err) {
          if (err) console.log("err",err)
      });
      stmt.finalize();
      io.emit('message', {
        roomId : room.id,
        userId: messageEv.source.userId,
        replyToken: messageEv.replyToken,
        eventType : messageEv.type,
        timestamp : Date.now(),//messageEv.timestamp ,
        sourceType : messageEv.source.type ,
        sourceUserId : messageEv.source.userId ,
        messageId : messageEv.message.id ,
        messageType: messageEv.message.type , 
        messageText: messageEv.message.text
      });

    });
    db.close();
}

function replyMessage(data) {
  console.log('replyMessage',data)
  var args = {
    headers: { 
        "Authorization": token,
        "Content-Type": "application/json" 
      }, // request headers 
      data : {
          "replyToken": data.replyToken,
          "messages":[{
            "type": "template",
            "altText": "กรุณาเลือกเมนูค่ะ",
            "template": {
                "type": "buttons",
                "thumbnailImageUrl": "http://www.centarahotelsresorts.com/images/upload/ctr/special_offer/full_size/krabi-swimming-pool-01-640x457.jpg",
                "title": "Menu",
                "text": "กรุณาเลือกเมนู",
                "actions": [
                    {
                        "type": "postback",
                        "label": "สอบถามที่อยู่",
                        "data": "action=inquireAddress"
                    },
                    {
                        "type": "postback",
                        "label": "โปรโมชั่น",
                        "data": "action=promotion"
                    },
                    {
                        "type": "uri",
                        "label": "เวปไซด์",
                        "uri": "http://www.centarahotelsresorts.com"
                    }
                ]
            }
          }]
      }
  };
  client.post("https://api.line.me/v2/bot/message/reply", args, 
  function (result, response) {
    // parsed response body as js object 
    console.log('result',result);
    // raw response 
    //console.log(response);
    //updateRoom({id : data.roomId},data)
  });
}
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