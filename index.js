var express = require('express')
var app = express()
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
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
  var drop = false;
  if (drop) {
    db.run("drop TABLE if exists messages")
    db.run("drop TABLE if exists chat_room")
    db.run("drop TABLE if exists contacts")
    db.run("drop TABLE if exists contact_persons")
    db.run("drop TABLE if exists contact_lines")
  }

  db.run("CREATE TABLE if not exists contacts ("+
        "contact_id TEXT, "+
        "code TEXT, "+
        "name TEXT,"+
        "short_name TEXT,"+
        "cstuser_id TEXT,"+
        "cstuser_pwd TEXT, "+
        "age INTEGER, "+
        "sex TEXT, "+
        "code1 TEXT, "+
        "active_flag INTEGER, "+
        "create_date INTEGER,"+
        "province_id TEXT, "+
        "zipcode TEXT)"
        );
  db.run("CREATE TABLE if not exists contact_persons ("+
        "contact_person_id INTEGER, "+
        "contact_id TEXT, "+
        "person_name TEXT,"+
        "email_addr TEXT,"+
        "active_flag INTEGER, "+
        "create_date TEXT)"
        );

  db.run("CREATE TABLE if not exists contact_lines ("+
        "contact_id TEXT, "+
        "contact_person_id INTEGER, "+
        "line_id TEXT,"+
        "line_name TEXT, "+
        "active_flag INTEGER, "+
        "join_date TEXT, "+
        "invite_by TEXT, "+
        "invite_date TEXT)"
        );

  db.run("CREATE TABLE if not exists messages ("+
        "roomId INTEGER, "+
        "replyToken TEXT, "+
        "eventType TEXT,"+
        "timestamp TEXT,"+
        "contact_id TEXT, "+
        "sourceType TEXT,"+
        "sourceUserId TEXT, "+
        "messageId TEXT, "+
        "messageType TEXT, "+
        "messageText TEXT, "+
        "stickerId INTEGER, "+
        "packageId INTEGER,"+
        "title TEXT, "+
        "address TEXT, "+
        "latitude TEXT, "+
        "longitude TEXT, "+
        "info TEXT)"
        );

  db.run("CREATE TABLE if not exists chat_room "+
        "(userId TEXT, "+
        "contact_id TEXT, "+
        "contact_person_id INTEGER, "+
        "displayName TEXT, "+
        "pictureUrl TEXT, "+
        "statusMessage TEXT,"+
        "sourceType TEXT,"+
        "messageType TEXT,"+
        "message TEXT,"+
        'createtime TEXT,'+
        'updatetime TEXT,'+
        "active_flag INTEGER)");
 
   if (drop) {
      var stmt = db.prepare("insert into contacts ("+
        "contact_id , "+
        "code , "+
        "name ,"+
        "short_name ,"+
        "cstuser_id ,"+
        "cstuser_pwd , "+
        "age , "+
        "sex , "+
        "code1 , "+
        "active_flag , "+
        "create_date ,"+
        "province_id , "+
        "zipcode ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
      stmt.run(["EFFE83A5-EF89-41E9-9A5E-12F4BD0FFDE6",
                "59",
                "บริษัท ยานภัณฑ์ จำกัด (โรงงาน 1)",
                "",
                "",
                "",
                0,
                "",
                "",
                "1",
                "",
                "",
                ""]);
      stmt.run(["E169D709-4ABC-4C25-A617-38412977944F",
                "C18629    ",
                "บริษัท บริการกรุงเทพเชิ้อเพลิงการบิน จำก",
                "",
                "",
                "",
                0,
                "",
                "",
                "1",
                "",
                "",
                ""]);
      stmt.finalize();

      stmt = db.prepare("insert into contact_persons ("+
        "contact_person_id , "+
        "contact_id , "+
        "person_name , "+
        "email_addr ,"+
        "active_flag , "+
        "create_date ) values (?, ?, ?, ?, ?, ? )");
      stmt.run(["CF563676-9AB2-4744-B461-017182546333",
                "EFFE83A5-EF89-41E9-9A5E-12F4BD0FFDE6",
                "วัฒนา ชัยดี",
                "wchaidee@gmail.com",
                "1",
                ""]);
      stmt.run(["A29B50EE-9AE8-4D82-A00C-050AD6CC27EE",
                "EFFE83A5-EF89-41E9-9A5E-12F4BD0FFDE6",
                "สุทธิ ถมยา",
                "suthi@gmail.com",
                "1",
                ""]);

      stmt.finalize();

      stmt = db.prepare("insert into contact_lines ("+
        "contact_id , "+
        "contact_person_id , "+
        "line_id ,"+
        "line_name , "+
        "active_flag , "+
        "join_date , "+
        "invite_by , "+
        "invite_date ) values (?, ?, ?, ?, ?, ?, ?, ? )");

      stmt.run(["EFFE83A5-EF89-41E9-9A5E-12F4BD0FFDE6",
                "CF563676-9AB2-4744-B461-017182546333",
                "Uaa89e07dfe96f3b66fe7937cf9e2c591",
                "Wat",
                "1",
                "","",""]);
      stmt.run(["EFFE83A5-EF89-41E9-9A5E-12F4BD0FFDE6",
                "A29B50EE-9AE8-4D82-A00C-050AD6CC27EE",
                "Ud674cfc68c5b8a10dd4799279e73a5c3",
                "Leo",
                "1",
                "","",""]);
      stmt.finalize();
                
   }
  /*
  db.prepare("INSERT INTO chat_room "+
                            "(userId ,displayName, pictureUrl, statusMessage, active_flag) "+
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
  socket.on('pushContactMessage', onPushContactMessage);
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
    var room = {
      id : data.roomId,
      contact_id : data.contactId
    }
    updateRoom(room,data)
  });
}

function onPushContactMessage (data) {
  var messageEv = data
  console.log(data)
  var lineIds = []
  var room = {
    id : 0,
    contact_id : data.contactId
  }
  var messageText = getMessageText(messageEv);
  var db = new sqlite3.Database(DATABASE_NAME);
  db.serialize(function() {
    async.series([
      function (callback) {
        db.all("SELECT line_id "+
              " FROM contact_lines "+
              "Where active_flag=1 and contact_id = ?",[data.contactId],
        function(err, rows) {
            for (var i=0; i<rows.length; i++) {
              lineIds.push(rows[i].line_id)
            }
            callback()
        });
      },

      function (callback) {
        saveMessage(db , room, messageEv, callback)
      },

      function (callback) {
        for (var i=0; i<lineIds.length; i++) {
          var args = {
            headers: { 
                "Authorization": token,
                "Content-Type": "application/json" 
              }, // request headers 
              data : {
                "to": lineIds[i],
                  "messages":[{
                    "type":"text",
                    "text":data.message.text
                  }]
              }
          };
          client.post("https://api.line.me/v2/bot/message/push", args, 
          function (result, response) {
            console.log('result',result);
          });
        }
        io.emit('message', {
          roomId : room.id,
          userId: messageEv.source.userId,
          contactId : room.contactId, 
          contactPersonId : room.contact_person_id,
          replyToken: messageEv.replyToken,
          eventType : messageEv.type,
          timestamp : Date.now(),//messageEv.timestamp ,
          sourceType : messageEv.source.type ,
          sourceUserId : messageEv.source.userId ,
          message : messageEv.message ,
          messageId : messageEv.message.id ,
          messageType: messageEv.message.type , 
          messageText: messageText,
          stickerId : messageEv.message.stickerId, 
          packageId : messageEv.message.packageId,
          title : messageEv.message.title,
          address : messageEv.message.address,
          latitude : messageEv.message.latitude,
          longitude : messageEv.message.longitude,
        });
        callback();
      }
    ],function(err) { 
      db.close();
      if (err) return next(err);
    })
  });
  
}

app.use('/classic',express.static('classic'))
app.use('/modern',express.static('modern'))
app.use('/resources',express.static('resources'))
app.use('/content',express.static('content'))

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

app.get('/getImage', function (req, res) {
  var args = {
      headers: { "Authorization": token } // request headers 
  };
  client.get("https://api.line.me/v2/bot/message/5491950525289/content", args, 
  function (result, response) {
      // parsed response body as js object 
      //console.log(result);
      // raw response 
      console.log(response);
      fs.writeFile('logo.png', result, 'binary', function(err){
          if (err) throw err
          console.log('File saved.')
      })
      res.send('Get Image success\n')
  });
  
})

app.post('/message', jsonParser,function (req, res) {
    var db = new sqlite3.Database(DATABASE_NAME);
    for (var i=0; i<req.body.events.length; i++) {
        var data = req.body.events[i];
        if (data.type == 'message') {
              if (data.message.type == 'text') {
                if (data.message.text == 'สอบถาม'||data.message.text.toLowerCase() == 'menu') {
                  replyMessage(data);
                }
              }
              var exists = true;
              var messageEv = data;
              db.get("SELECT rowid AS id, * FROM chat_room where userId = ? and active_flag=1 LIMIT 1", [messageEv.source.userId],
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
                      data.timestamp,data.source.type,data.source.userId],JSON.stringify(data));
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

app.get('/listAllMessage',function (req, res) {
  //console.log(req)
  var db = new sqlite3.Database(DATABASE_NAME);
  var messages = [];
  db.all("SELECT messages.rowid AS id, replyToken, eventType, timestamp ,sourceType, "+
         "sourceUserId , messageId , messageType , messageText ,info "+
         "FROM messages ",
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

app.get('/listContact',function (req, res) {
  //console.log(req)
  var db = new sqlite3.Database(DATABASE_NAME);
  var messages = [];
  db.all("SELECT rowid AS id,"+
        "contact_id , "+
        "code , "+
        "name ,"+
        "short_name ,"+
        "cstuser_id ,"+
        "cstuser_pwd , "+
        "age , "+
        "sex , "+
        "code1 , "+
        "active_flag , "+
        "create_date ,"+
        "province_id , "+
        "zipcode "+
        "FROM contacts ",
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
          contact_id: row.contact_id,
          code : row.code,
          name : row.name ,
          short_name : row.short_name ,
          cstuser_id : row.cstuser_id ,
          cstuser_pwd : row.cstuser_pwd ,
          age: row.age , 
          sex: row.sex,
          code1: row.code1
        })
      }
      //console.log(messages)
      res.json(messages);

  });
  //console.log('WWWWW',messages)
  db.close();
});

app.get('/listMessage',function (req, res) {
  //console.log(req)
  var db = new sqlite3.Database(DATABASE_NAME);
  var messages = [];
  var sql = "SELECT messages.rowid AS id, roomId, replyToken, eventType, timestamp ,messages.sourceType, "+
         "sourceUserId , messageId , messages.messageType , messageText ,info, "+
         "stickerId, packageId ,title, address, latitude, longitude "+
         "FROM messages , chat_room "+
         "where messages.sourceUserId = chat_room.userId "+
         "and chat_room.rowid = ? and eventType='message'"
  if (req.query.contactId) {
    sql = "SELECT messages.rowid AS id, 0 as roomId, replyToken, eventType, timestamp ,messages.sourceType, "+
         "contact_id, sourceUserId , messageId , messages.messageType , messageText ,info, "+
         "stickerId, packageId ,title, address, latitude, longitude "+
         "FROM messages "+
         "where messages.contact_id = ? "+
         "and eventType='message'"
  }
  db.all(sql,req.query.contactId?[req.query.contactId]:[req.query.roomId], 
    function(err, rows) {
      console.log(err,rows)
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
          contactId : row.contact_id ,
          sourceUserId : row.sourceUserId ,
          messageId : row.messageId ,
          messageType: row.messageType , 
          messageText: row.messageText,
          message: row.info,
          stickerId : row.stickerId, 
          packageId : row.packageId,
          title : row.title,
          address : row.address,
          latitude : row.latitude,
          longitude : row.longitude
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
  db.all("SELECT rowid AS id, sourceType,userId ,contact_id, contact_person_id, displayName, pictureUrl,"+ 
         "statusMessage, messageType, message ,createtime, updatetime, active_flag FROM chat_room",
  function(err, rows) {
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
          contact_id : row.contact_id, 
          contact_person_id : row.contact_person_id,
          displayName : row.displayName,
          pictureUrl : row.pictureUrl ,
          statusMessage : row.statusMessage ,
          message : row.message ,
          messageType : row.messageType,
          messageText : row.message ,
          sourceType : row.sourceType,
          createtime : row.createtime ,
          updatetime : row.updatetime ,
          active_flag : row.active_flag
        })
      }
      //console.log(messages)
      res.json(messages);

  });
  //console.log('WWWWW',messages)
  db.close();
});

app.get('/listContactRoom',function (req, res) {
  //console.log(req)
  var db = new sqlite3.Database(DATABASE_NAME);
  var messages = [];
  async.series([
    function (callback) {
      db.all("SELECT chat_room.contact_id, contacts.name ,max(chat_room.updatetime) as updatetime"+ 
            " FROM chat_room , contacts "+
            "Where chat_room.contact_id = contacts.contact_id"+
            " group by  chat_room.contact_id, contacts.name",
      function(err, rows) {
          /*
          console.log(row.id + ": " , row.replyToken, row.eventType, row.timestamp ,
          row.sourceType ,row.sourceUserId , row.messageId , row.messageType , 
          row.messageText,row.info);
          */
          for (var i=0; i<rows.length; i++) {
            var row = rows[i]
            messages.push({
              contactId : row.contact_id, 
              displayName : row.name,
              updatetime : row.updatetime
            })
          }
          callback()
      });
    },
    function (callback) {
        callback()
      
    }],function(err) { //This function gets called after the two tasks have called their "task callbacks"
        db.close();
        if (err) return next(err);
        //Here locals will be populated with `user` and `posts`
        //Just like in the previous example
        res.json(messages);
      })
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
            db.get("SELECT rowid AS id, contact_id , "+
                    "contact_person_id , "+
                    "line_id ,"+
                    "line_name FROM contact_lines "+
                    "where line_id = ? and active_flag=1 LIMIT 1", [messageEv.source.userId],
              function(err, row){
                if(err) throw err;
                if(typeof row == "undefined") {
                    room.contact_id = null
                    room.contact_person_id = null
                    room.line_id = null
                    room.line_name = null
                } else {
                    room.contact_id = row.contact_id
                    room.contact_person_id = row.contact_person_id
                    room.line_id = row.line_id
                    room.line_name = row.line_name
                }
                callback();
              });
          },
          function (callback) {
            db.run("INSERT INTO chat_room "+
              "(userId ,contact_id, contact_person_id, sourceType, displayName, pictureUrl, statusMessage, active_flag) "+
              "select ?, ?, ?, ?, ?, ?, ?, ? WHERE NOT EXISTS(SELECT 1 FROM chat_room WHERE userId = ? and active_flag=1)",
            [messageEv.source.userId, room.contact_id, room.contact_person_id, messageEv.source.type, "", "", "" , 1, messageEv.source.userId],
            function () {
              room.id = this.lastID;
              console.log("lastID",this.lastID)
              callback();
            })
          },
          function (callback) {
            saveMessage(db , room, messageEv, callback)
          },

          function (callback) {
            console.log("Update  chat_room", [room.id,messageEv.source.userId,"","","",1]);
            var messageText = getMessageText(messageEv);
            db.run("update chat_room set "+
                  "displayName = ?"+
                  ",pictureUrl = ?"+
                  ",statusMessage = ? "+
                  ",messageType = ? "+
                  ",message = ? "+
                  ",createtime = ? "+
                  "WHERE userId = ? and active_flag=1",
            [result.displayName, result.pictureUrl,
            result.statusMessage, messageEv.message.type,
            messageText, messageEv.timestamp, messageEv.source.userId])
            console.log("Update chat_room", [result.displayName, result.pictureUrl,result.statusMessage ,messageEv.source.userId]);
            io.emit('newroom', {
                id : room.id,
                userId: messageEv.source.userId,
                contactId : room.contact_id, 
                contactPersonId : room.contact_person_id,
                sourceType : messageEv.source.type,
                sourceUserId: messageEv.source.userId,
                displayName : result.displayName,
                pictureUrl : result.pictureUrl ,
                statusMessage : result.statusMessage ,
                message : messageEv.message ,
                messageId : messageEv.message.id ,
                stickerId : messageEv.message.stickerId, 
                packageId : messageEv.message.packageId,
                title : messageEv.message.title,
                address : messageEv.message.address,
                latitude : messageEv.message.latitude,
                longitude : messageEv.message.longitude,
                messageText : messageText,
                messageType: messageEv.message.type , 
                createtime : messageEv.timestamp ,
                updatetime : messageEv.timestamp ,
                active_flag : 1
            });
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
      async.series([
        function (callback) {
          saveMessage(db , room, messageEv, callback)
        },

        function (callback) {
          var messageText = getMessageText(messageEv);
          db.run("update chat_room set "+
                "messageType = ? "+
                ",message = ? "+
                ",sourceType = ? "+
                ",updatetime = ? "+
                "WHERE userId = ? and active_flag=1",
          [messageEv.message.type, messageText, messageEv.source.type, 
          messageEv.timestamp, messageEv.source.userId]);
          io.emit('message', {
            roomId : room.id,
            userId: messageEv.source.userId,
            contactId : room.contact_id, 
            contactPersonId : room.contact_person_id,
            replyToken: messageEv.replyToken,
            eventType : messageEv.type,
            timestamp : Date.now(),//messageEv.timestamp ,
            sourceType : messageEv.source.type ,
            sourceUserId : messageEv.source.userId ,
            message : messageEv.message ,
            messageId : messageEv.message.id ,
            messageType: messageEv.message.type , 
            messageText: messageText,
            stickerId : messageEv.message.stickerId, 
            packageId : messageEv.message.packageId,
            title : messageEv.message.title,
            address : messageEv.message.address,
            latitude : messageEv.message.latitude,
            longitude : messageEv.message.longitude,
          });
          callback();
        }
      ],function(err) { 
        db.close();
        if (err) return next(err);
      })
    });
}

function getMessageText (messageEv) {
    if (messageEv.message.type == 'text'){
      return messageEv.message.text
    } else if (messageEv.message.type == 'image'){
      return "send you a photo"
    } else if (messageEv.message.type == 'video'){
      return "send you a video"
    } else if (messageEv.message.type == 'audio'){
      return "send you a audio"
    } else if (messageEv.message.type == 'location'){
      return "send you a location"
    } else if (messageEv.message.type == 'sticker'){
      return "send you a sticker"
    }
}

function saveMessage(db , room, messageEv, callback) {
  console.log("INSERT INTO messages ",
              [room.id, messageEv.replyToken, messageEv.type, 
              messageEv.timestamp,messageEv.source.type,messageEv.source.userId,
              messageEv.message.id, messageEv.message.type, messageEv.message.text]);
    var stmt = db.prepare("INSERT INTO messages "+
      "(roomId ,replyToken ,eventType ,timestamp ,sourceType ,"+
      "contact_id, sourceUserId , messageId ,messageType , "+
      "messageText, stickerId, packageId, "+
      "title, address, latitude, longitude, "+
      "info) "+ 
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    stmt.run([room.id, messageEv.replyToken, messageEv.type, 
              messageEv.timestamp,messageEv.source.type,
              room.contact_id, messageEv.source.userId,
              messageEv.message.id, messageEv.message.type, 
              messageEv.message.text,
              messageEv.message.type == 'sticker'? messageEv.message.stickerId : 0,
              messageEv.message.type == 'sticker'? messageEv.message.packageId : 0,
              messageEv.message.type == 'location'? messageEv.message.title : "",
              messageEv.message.type == 'location'? messageEv.message.address : "",
              messageEv.message.type == 'location'? messageEv.message.latitude : "",
              messageEv.message.type == 'location'? messageEv.message.longitude : "",
              JSON.stringify(messageEv)],
      function(err) {
        if (err) console.log("err",err)
    });
    
    stmt.finalize();

    if (messageEv.message.type == 'image') {
      var dir = __dirname+'/content/images/'+room.id+"/";
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      var args = {
      headers: { "Authorization": token } // request headers 
      };
      client.get("https://api.line.me/v2/bot/message/"+messageEv.message.id+"/content", args, 
      function (result, response) {
          fs.writeFile(dir+messageEv.message.id+'.png', result, 'binary', 
          function(err){
              if (err) throw err
              console.log('File saved.')
              callback();
          })
      });
    } else if (messageEv.message.type == 'audio') {
      var dir = __dirname+'/content/audios/'+room.id+"/";
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      var args = {
      headers: { "Authorization": token } // request headers 
      };
      client.get("https://api.line.me/v2/bot/message/"+messageEv.message.id+"/content", args, 
      function (result, response) {
          fs.writeFile(dir+messageEv.message.id+'.mp4', result, 'binary', 
          function(err){
              if (err) throw err
              console.log('File saved.')
              callback();
          })
      });
    } else if (messageEv.message.type == 'video') {
      var dir = __dirname+'/content/videos/'+room.id+"/";
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      var args = {
      headers: { "Authorization": token } // request headers 
      };
      client.get("https://api.line.me/v2/bot/message/"+messageEv.message.id+"/content", args, 
      function (result, response) {
          fs.writeFile(dir+messageEv.message.id+'.mp4', result, 'binary', 
          function(err){
              if (err) throw err
              console.log('File saved.')
              callback();
          })
      });
    } else {
      callback();
    }

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
                "thumbnailImageUrl": "https://limitless-crag-52851.herokuapp.com/resources/images/example.jpg",
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