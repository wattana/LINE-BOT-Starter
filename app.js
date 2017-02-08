var express = require('express')
var fileUpload = require('express-fileupload');
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
var WebServiceURL = "http://vm:46233/";
var mime = require('mime');
var Connection = require('tedious').Connection;
var DbRequest = require('tedious').Request;
var TYPES = require('tedious').TYPES;

process.on('uncaughtException', function(e){
    console.log(e.stack);
});

var dbConfig = {
    userName: '*******',
    password: '*******',
    server: '172.16.93.***',

    // If you're on Windows Azure, you will need this:
    options: {
        encrypt: false,
        database : 'imind_standard_2016',
        port : 1433,
        rowCollectionOnRequestCompletion : false
    }
};
var db = new Connection(dbConfig);

db.on('connect', function(err) {
    if (err) {
        console.log(err)
        return;
    }
    var drop = false;
    if (drop) {
        async.series([
            function (callback) {
                db.execSql(new DbRequest("drop TABLE line_messages",function(err, rowCount, rows) {
                    if (err) console.log('drop table error 1:',err);
                    else console.log('drop table line_messages success 1');
                    callback();
                }))
            },
            function (callback) {
                db.execSql(new DbRequest("drop TABLE line_chat_room",function(err, rowCount, rows) {
                    if (err) console.log('drop table error 2:',err);
                    else console.log('drop table line_chat_room success 1');
                    callback();
                }))
            },
            function (callback) {
                db.execSql(new DbRequest("drop TABLE contact_lines",function(err, rowCount, rows) {
                    if (err) console.log('drop table error 3:',err);
                    else console.log('drop table contact_lines success 1');
                    callback();
                }))
            },
            function (callback) {
                var request = new DbRequest(
                    "if not exists (select * from sysobjects where name='contact_lines' and xtype='U')"+
                        "CREATE TABLE contact_lines ("+
                        "[id] [int] IDENTITY(1,1) NOT NULL,"+
                        "[contact_id] [uniqueidentifier], "+
                        "[contact_person_id] [uniqueidentifier], "+
                        "line_id [nvarchar](100) NOT NULL,"+
                        "line_name [nvarchar](100) NOT NULL, "+
                        "sourceType [varchar](35) DEFAULT (''), "+
                        "statusMessage [nvarchar](250) NOT NULL, "+
                        "pictureUrl [nvarchar](250) DEFAULT (''), "+
                        "active_flag [char](1) NOT NULL, "+
                        "join_date bigint, "+
                        "invite_by [uniqueidentifier] NULL, "+
                        "invite_date bigint)",
                    function(err, rowCount) {
                        if (err) {
                            console.log("create table contact_lines error : "+err);
                        } else {
                            console.log("create table contact_lines success :" +rowCount + ' rows');
                        }
                        callback();
                    }); 
                db.execSql(request);
            },
            function (callback) {
                var request = new DbRequest(
                    "if not exists (select * from sysobjects where name='line_messages' and xtype='U')"+
                        "CREATE TABLE line_messages ("+
                        "[id] [int] IDENTITY(1,1) NOT NULL,"+
                        "roomId int, "+
                        "replyToken [nvarchar](50) NOT NULL DEFAULT (''), "+
                        "eventType [nvarchar](20) NOT NULL DEFAULT (''),"+
                        "timestamp bigint,"+
                        "contact_id [uniqueidentifier] NULL, "+
                        "sourceType [nvarchar](20) NOT NULL DEFAULT (''),"+
                        "sourceUserId [nvarchar](40) NOT NULL DEFAULT (''), "+
                        "messageId [nvarchar](50) NOT NULL DEFAULT (''), "+
                        "messageType [nvarchar](20) NOT NULL DEFAULT (''), "+
                        "messageText [nvarchar](500) NULL, "+
                        "stickerId int, "+
                        "packageId int,"+
                        "title [nvarchar](200) NULL , "+
                        "address [nvarchar](300) NULL, "+
                        "latitude [nvarchar](50) NULL, "+
                        "longitude [nvarchar](50) NULL, "+
                        "filePath [nvarchar](200) NULL, "+
                        "fileName [nvarchar](200) NULL, "+
                        "originalFileName [nvarchar](200) NULL, "+
                        "info [nvarchar](max) NOT NULL DEFAULT (''))",
                    function(err, rowCount) {
                        if (err) {
                            console.log("create table line_messages error : "+err);
                        } else {
                            console.log("create table line_messages success :" +rowCount + ' rows');
                        }
                        callback();
                    }); 
                db.execSql(request);
            },
            function (callback) {
                var request = new DbRequest(
                    "if not exists (select * from sysobjects where name='line_chat_room' and xtype='U')"+
                        "CREATE TABLE line_chat_room ("+
                        "[id] [int] IDENTITY(1,1) NOT NULL,"+
                        "userId [nvarchar](40) NOT NULL DEFAULT (''), "+
                        "contact_id [uniqueidentifier], "+
                        "contact_person_id [uniqueidentifier], "+
                        "displayName [nvarchar](100) DEFAULT (''), "+
                        "pictureUrl [nvarchar](200) DEFAULT (''), "+
                        "statusMessage [nvarchar](100) DEFAULT (''),"+
                        "sourceType [nvarchar](20) DEFAULT (''),"+
                        "messageType [nvarchar](20) DEFAULT (''),"+
                        "message [nvarchar](500) DEFAULT (''),"+
                        "createtime bigint,"+
                        "updatetime bigint,"+
                        "active_flag [char](1) NOT NULL)",
                    function(err, rowCount) {
                        if (err) {
                            console.log("create table error : "+err);
                        } else {
                            console.log("create table contact_lines success :" +rowCount + ' rows');
                        }
                        callback();
                    }); 
                db.execSql(request);
            }
        ], function () {
            db.close();
        })
    }
});
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
        "messages":[data.message]
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
    var db = new Connection(dbConfig);
    db.on('connect', function(err) {
        if (err) {
            console.log(err)
            return;
        }
        async.series([
            function (callback) {
              updateRoom(db, room,data ,callback)
            }
        ],function(){
          db.close();
        })
    });
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
  var db = new Connection(dbConfig);
  db.on('connect', function(err) {
    if (err) {
        console.log('onPushContactMessage error ',err)
        return;
    }
    async.series([
      function (callback) {
        var request = new DbRequest(
          "select line_name as lineName, pictureUrl from contact_lines where line_id = @lineId", 
          function(err, rowCount , row) {
            if (err) {
              console.log("select line_messages error ",err);
            }  
            callback()     
          });

          request.on('row', function(columns) {
            //console.log('-------------------',columns[0])
            columns.forEach(function(column) {
              room[column.metadata.colName] = column.value
            });
        });
        request.addParameter('lineId', TYPES.VarChar, data.source.userId);
        db.execSql(request);
      },
      function (callback) {
        var request = new DbRequest(
          "SELECT line_id ,line_name as lineName, pictureUrl "+
          " FROM contact_lines "+
          "Where active_flag='1' and contact_id = @contactId", 
          function(err, rowCount , row) {
            if (err) {
              console.log("select line_messages error ",err);
            }    
            callback()
          });

          request.on('row', function(columns) {
            //console.log('-------------------',columns[0])
            var record = {};
            columns.forEach(function(column) {
              record[column.metadata.colName] = column.value
            });
            lineIds.push(record.line_id)
          });
          request.addParameter('contactId', TYPES.VarChar, data.contactId);
          db.execSql(request);
          /*
        db.all("SELECT line_id "+
              " FROM contact_lines "+
              "Where active_flag=1 and contact_id = ?",[data.contactId],
        function(err, rows) {
            for (var i=0; i<rows.length; i++) {
              lineIds.push(rows[i].line_id)
            }
            callback()
        });
        */
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
        console.log("push contact message")
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
          pictureUrl : room.pictureUrl,
          lineName : room.lineName
        });
        callback();
      }
    ],function(err) { 
      db.close();
      if (err) return next(err);
    })
  });
  
}

app.use(fileUpload());

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

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});


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

app.get('/testSeries', function (req, res) {
  async.series([
        function (cb) {
          async.series([
                function (callback) {
                  console.log(1.1)
                  callback()
                }
          ],function() {
            cb()
          })
          console.log(1)
        }
  ])
  res.send('Test Series success\n')
  
})

app.get('/testDb', function (req, res) {
    var db = new Connection(dbConfig);

    db.on('connect', function(err) {
        // If no error, then good to go...
        db.close();
        res.send('Test DB success\n'+err)    
    });

    db.on('end', function(err) {
        console.log("Connection End")
    })
  
})

var soap = require('soap');
app.get('/testSoapUpload', function (req, res) {
    var url = 'http://vm:46233/requestaeroservice.asmx?WSDL';
    var args = {name: 'value'};
  
    soap.createClient(url, function(err, client) {
      console.log(client.describe().RequestAeroService.RequestAeroServiceSoap.upload)
      //res.send("ok") 
      /*
      client.search({
        start : 0,
        limit : 10
      }, function(err, result) {
          //console.log(result);
          res.send(result) 
      });
      */
      var dir = __dirname+'/content/';
      var file_payload;
      // Load the file into a buffer
      fs.readFile(dir+'DashBoardSpec.pdf', function(err, the_data) {
        if (err) console.error(err);
        
        // Encode the buffer to base64
        file_payload = new Buffer(the_data, 'binary').toString('base64');
        
        // Set the parameters before we call the Web Service
        var parameters = {
          fileName : 'test.pdf',
          buffer : file_payload,
          Offset : 0
        };
        
        console.log('      sending...')
        // Make the Web Service call, remember node likes callbacks
        client.upload(parameters, function(err, result) {
          if (err) console.error(err);
          
          console.log(result);
          
          // This file is done, next!
          res.send(result) 
        });
      });
    });  
    
})

app.get('/testSoap', function (req, res) {
    var url = WebServiceURL+'requestsservice.asmx?WSDL';
  
    soap.createClient(url, function(err, client) {
      console.log(client.describe().RequestsService.RequestsServiceSoap.save)
      client.save({
        data : {
          RequestDetail : "RequestDetail",
          ContactId : 'EBE65C2F-963B-4C3F-82C5-021465467FD3',
          LogBy : 'AB30D036-5F28-44B4-9138-59A09DC49A5A'
        }
      }, function(err, result) {
          //console.log(result);
          res.send(result) 
      });
      
      
    });      
})

app.post('/message', jsonParser,function (req, res) {
    if (req.body.events.length <=0) {
        res.send('No Message !!! \n')
        return;
    }
    var db = new Connection(dbConfig);
    db.on('connect', function(err) {
        if (err) {
            console.log(err)
            return;
        }
        var i =0;
        //req.body.events.forEach(function(data) {
        async.eachSeries(req.body.events , function(data, cbx) {
            console.log('body data',data );
            async.series([
                function (callback) {
                    if (data.type == 'message') {
                        messageHandler(db, data , callback);
                    } else if (data.type == 'follow') {
                        followHandler(db, data , callback);
                    } else {
                        saveNotMessageType(db , data, callback)
                    }
                }
            ],function(err , result) {
                if (i==req.body.events.length-1)
                    db.close();
                i++;
                cbx()
            })
        })
    });
    /*
    for (var i=0; i<req.body.events.length; i++) {
        var data = req.body.events[i];
    }
    */
    //console.log("message body ",JSON.stringify(req.body));
    res.send('Message success\n')
})

app.post('/createRequest', jsonParser,function (req, res) {
    var ids = JSON.parse(req.body.ids) 
    console.log("ids",ids)
    var messages = [];
    var messageTexts = [];
    var db = new Connection(dbConfig);
    db.on('connect', function(err) {
        if (err) {
            console.log(err)
            return;
        }
        var request = new DbRequest(
          "select * from line_messages where id in ("+ids.join(",")+")", 
          function(err, rowCount , row) {
              db.close();
              if (err) {
                console.log("select line_messages error ",err);
              }       
              //console.log("message",messages)

              var url = WebServiceURL+'requestsservice.asmx?WSDL';
              soap.createClient(url, function(err, client) {
                  //console.log(client.describe().RequestsService.RequestsServiceSoap.save)
                  var attachList = [];
                  async.series([
                    function (callback) {
                        if (req.body.requestNumber) {
                            client.loadRequests({
                                requestNumber : req.body.requestNumber,
                            }, function(err, result) {
                                console.log("loadRequests", result)
                                if (result.loadRequestsResult.RowXs) {
                                  callback()
                                } else {
                                  callback({
                                    success : false,
                                    msg : 'ไม่พบใบงาน กรุณาป้อนใหม่'
                                  });
                                }
                            });
                        } else {
                            callback();
                        }
                    },
                    function (callback) {
                        var i =0;
                        async.eachSeries(messages , function(data, cbx) {
                            //console.log('messages data',data );
                             var isContent = data.messageType == 'image' || data.messageType == 'audio' ||
                                             data.messageType == 'video' || data.messageType == 'file'
                            if (isContent) {
                                //console.log(client.describe().RequestsService.RequestsServiceSoap.saveAttach)
                                var filePath = __dirname+'/'+data.filePath+data.fileName;
                                var minetype = mime.lookup(filePath);
                                //console.log("minetype",minetype)
                                var file_payload;
                                // Load the file into a buffer
                                fs.readFile(filePath, function(err, the_data) {
                                  if (err) console.error(err);
                                  
                                  // Encode the buffer to base64
                                  file_payload = new Buffer(the_data, 'binary').toString('base64');
                                  
                                  // Set the parameters before we call the Web Service
                                  var parameters = {
                                    data: { 
                                        FileName: data.fileName,
                                        FileType: minetype,
                                        FileSize: the_data.length,
                                        OriginalFilename: data.originalFileName,
                                        Description: '',
                                        ActiveFlag: '1'
                                    },
                                    fileName : data.originalFileName,
                                    buffer : file_payload,
                                    Offset : 0
                                  };
                                  
                                  //console.log('      sending...')
                                  // Make the Web Service call, remember node likes callbacks
                                  client.saveAttach(parameters, function(err, result) {
                                      if (err) console.error(err);
                                      //console.log("upload result",result)
                                      attachList.push({
                                        id : result.saveAttachResult.refId,
                                        description : ""
                                      })
                                      if (i==messages.length-1)
                                          callback();
                                      i++;
                                      cbx()
                                  });
                                });
                            } else {
                              if (i==messages.length-1)
                                  callback();
                              i++;
                              cbx()
                            }
                        });
                    },
                    function (callback) {
                        //console.log("attachList",attachList)
                        client.save({
                          data : {
                            RequestNumber : req.body.requestNumber,
                            RequestDetail : messageTexts.join("\n"),
                            ContactId : req.body.contactId,
                            LogBy : req.body.agentId,
                            AttachmentList : JSON.stringify(attachList)
                          }
                        }, function(err, result) {
                            callback(null, result);
                        });
                    }
                  ],function (err , result) {
                    console.log("result",result)
                    if (err) {
                        console.log("result",err,result)
                        res.json(err);
                    } else {
                        res.json(result[2].saveResult);
                    }
                  });  
              })
          });

          request.on('row', function(columns) {
            //console.log('-------------------',columns[0])
            var record = {};
            columns.forEach(function(column) {
              record[column.metadata.colName] = column.value
            });
            messages.push(record)
            if (record.messageType == 'text') {
                messageTexts.push(record.messageText)
            }
        });
        db.execSql(request);
    })
})

app.get('/listRequest',function (req, res) {
  //console.log(req)
  var messages = [];
  var db = new Connection(dbConfig);
  db.on('connect', function(err) {
      if (err) {
          console.log(err)
          return;
      }
      var request = new DbRequest(
        "SELECT top 10 * FROM requests order by open_date desc ", 
        function(err, rowCount , row) {
          db.close();
          if (err) {
            console.log("select requests error ",err);
          }       
          res.json(messages);
        });

        request.on('row', function(columns) {
          //console.log('-------------------',columns[0])
          var record = {};
          columns.forEach(function(column) {
            record[column.metadata.colName] = column.value
          });
          record.request_detail= record.request_detail.replace(/\n/g,"<br/>")
          messages.push(record)
        });
        db.execSql(request);
  })
});

app.get('/listAllMessage',function (req, res) {
    //console.log(req)
    var messages = [];
    var db = new Connection(dbConfig);
    db.on('connect', function(err) {
        if (err) {
            console.log(err)
            return;
        }
        var request = new DbRequest(
          "SELECT id, replyToken, eventType, timestamp ,sourceType, "+
          "sourceUserId , messageId , messageType , messageText ,info "+
          "FROM line_messages ", 
          function(err, rowCount , row) {
            db.close();
            if (err) {
              console.log("select line_messages error ",err);
            }       
            res.json(messages);
          });

          request.on('row', function(columns) {
            //console.log('-------------------',columns[0])
            var record = {};
            columns.forEach(function(column) {
              record[column.metadata.colName] = column.value
            });
            messages.push(record)
          });
          db.execSql(request);
    })

/*
  var db = new sqlite3.Database(DATABASE_NAME);
  var messages = [];
  db.all("SELECT messages.rowid AS id, replyToken, eventType, timestamp ,sourceType, "+
         "sourceUserId , messageId , messageType , messageText ,info "+
         "FROM messages ",
    function(err, rows) {
      console.log(rows)
      
      //console.log(row.id + ": " , row.replyToken, row.eventType, row.timestamp ,
      //row.sourceType ,row.sourceUserId , row.messageId , row.messageType , 
      //row.messageText,row.info);
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
  */
});

app.get('/listContact',function (req, res) {
  //console.log(req)
  var messages = [];
  var db = new Connection(dbConfig);
  db.on('connect', function(err) {
      if (err) {
          console.log(err)
          return;
      }
      var request = new DbRequest(
        "SELECT top 10 "+
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
        function(err, rowCount , row) {
          db.close();
          if (err) {
            console.log("select line_messages error ",err);
          }       
          res.json(messages);
        });

        request.on('row', function(columns) {
          //console.log('-------------------',columns[0])
          var record = {};
          columns.forEach(function(column) {
            record[column.metadata.colName] = column.value
          });
          messages.push(record)
        });
        db.execSql(request);
  })
 /*  
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
      //console.log(row.id + ": " , row.replyToken, row.eventType, row.timestamp ,
      //row.sourceType ,row.sourceUserId , row.messageId , row.messageType , 
      //row.messageText,row.info);
      
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
  */
});

app.get('/listMessage',function (req, res) {
  //console.log(req)
  var messages = [];
  var sql = "SELECT messages.id AS id, roomId, replyToken, eventType, timestamp ,messages.sourceType, "+
         "messages.contact_id as contactId, sourceUserId , messageId,"+
         "messages.messageType , messageText ,info as message ,contact_lines.pictureUrl, "+
         "stickerId, packageId ,title, address, latitude, longitude, "+
         "filePath, fileName , originalFileName ,line_name as lineName "+
         "FROM line_messages messages , line_chat_room chat_room "+
         ",contact_lines "+
         "where messages.roomId = chat_room.id "+
         "and contact_lines.line_id = messages.sourceUserId "+
         "and chat_room.id = @roomId and eventType='message' "+
         "order by messages.timestamp"
  if (req.query.contactId) {
    sql = "SELECT messages.id AS id, roomId, replyToken, eventType, timestamp ,messages.sourceType, "+
         "messages.contact_id as contactId, sourceUserId , messageId, "+
         "messages.messageType , messageText ,info as message, contact_lines.pictureUrl,"+
         "stickerId, packageId ,title, address, latitude, longitude, "+
         "filePath, fileName , originalFileName, line_name as lineName "+
         "FROM line_messages messages "+
         ",contact_lines "+
         "where messages.contact_id = @contactId "+
         "and contact_lines.line_id = messages.sourceUserId "+
         "and eventType='message' "+
         "order by messages.timestamp"
  }
  //console.log("listMessage", sql)
  var messages = [];
  var db = new Connection(dbConfig);
  db.on('connect', function(err) {
      if (err) {
          console.log(err)
          return;
      }
      var request = new DbRequest(sql, 
        function(err, rowCount , row) {
          db.close();
          if (err) {
            console.log("select line_messages error ",err);
          }       
          res.json(messages);
        });

        request.on('row', function(columns) {
          //console.log('-------------------',columns[0])
          var record = {};
          columns.forEach(function(column) {
            record[column.metadata.colName] = column.value
          });
          messages.push(record)
      });
      if (req.query.contactId)
        request.addParameter('contactId', TYPES.VarChar, req.query.contactId);
      else 
        request.addParameter('roomId', TYPES.VarChar, req.query.roomId);
      db.execSql(request);
  })
 /*  
  var db = new sqlite3.Database(DATABASE_NAME);
  db.all(sql,req.query.contactId?[req.query.contactId]:[req.query.roomId], 
    function(err, rows) {
      console.log(err,rows)
      //console.log(row.id + ": " , row.replyToken, row.eventType, row.timestamp ,
      //row.sourceType ,row.sourceUserId , row.messageId , row.messageType , 
      //row.messageText,row.info);
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
          longitude : row.longitude,
          filePath : row.filePath,
          fileName : row.fileName,
          originalFileName : row.originalFileName,
        })
      }
      //console.log(messages)
      res.json(messages);

  });
  //console.log('WWWWW',messages)
  db.close();
  */
});

app.get('/listRoom',function (req, res) {
  //console.log(req)
  var messages = [];
  var db = new Connection(dbConfig);
  db.on('connect', function(err) {
      if (err) {
          console.log(err)
          return;
      }
      var request = new DbRequest(
        "SELECT id, sourceType,userId ,contact_id, contact_person_id, displayName, pictureUrl,"+ 
        "statusMessage, messageType, message ,createtime, updatetime, active_flag FROM line_chat_room", 
        function(err, rowCount , row) {
          db.close();
          if (err) {
            console.log("select line_messages error ",err);
          }       
          res.json(messages);
        });

        request.on('row', function(columns) {
          //console.log('-------------------',columns[0])
          var record = {};
          columns.forEach(function(column) {
            record[column.metadata.colName] = column.value
          });
          record.contactId = record.contact_id
          record.contactPersonId = record.contact_person_id
          record.messageText = record.message ,
          messages.push(record)
        });
        db.execSql(request);
  })
  /*
  var db = new sqlite3.Database(DATABASE_NAME);
  var messages = [];
  db.all("SELECT rowid AS id, sourceType,userId ,contact_id, contact_person_id, displayName, pictureUrl,"+ 
         "statusMessage, messageType, message ,createtime, updatetime, active_flag FROM chat_room",
  function(err, rows) {
      
      //console.log(row.id + ": " , row.replyToken, row.eventType, row.timestamp ,
      //row.sourceType ,row.sourceUserId , row.messageId , row.messageType , 
      //row.messageText,row.info);
      for (var i=0; i<rows.length; i++) {
        var row = rows[i]
        messages.push({
          id : row.id,
          userId: row.userId,
          contact_id : row.contact_id, 
          contact_person_id : row.contact_person_id,
          contactId : row.contact_id, 
          contactPersonId : row.contact_person_id,
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
  */
});

app.get('/listContactRoom',function (req, res) {
  //console.log(req)
  var messages = [];
  var db = new Connection(dbConfig);
  db.on('connect', function(err) {
      if (err) {
          console.log(err)
          return;
      }
      var request = new DbRequest(
        "SELECT chat_room.contact_id as contactId, contacts.name as displayName ,max(chat_room.updatetime) as updatetime"+ 
        " FROM line_chat_room chat_room , contacts "+
        "Where chat_room.contact_id = contacts.contact_id"+
        " group by  chat_room.contact_id, contacts.name", 
        function(err, rowCount , row) {
          db.close();
          if (err) {
            console.log("select line_messages error ",err);
          }       
          res.json(messages);
        });

        request.on('row', function(columns) {
          //console.log('-------------------',columns[0])
          var record = {};
          columns.forEach(function(column) {
            record[column.metadata.colName] = column.value
          });
          messages.push(record)
        });
        db.execSql(request);
  })
 /*
  var db = new sqlite3.Database(DATABASE_NAME);
  var messages = [];
  async.series([
    function (callback) {
      db.all("SELECT chat_room.contact_id, contacts.name ,max(chat_room.updatetime) as updatetime"+ 
            " FROM chat_room , contacts "+
            "Where chat_room.contact_id = contacts.contact_id"+
            " group by  chat_room.contact_id, contacts.name",
      function(err, rows) {
          //console.log(row.id + ": " , row.replyToken, row.eventType, row.timestamp ,
          //row.sourceType ,row.sourceUserId , row.messageId , row.messageType , 
          //row.messageText,row.info);
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
      */
});

app.get('/listContactTree',function (req, res) {
  //console.log(req)
  var messages = {
    text : ".",
    "children": []
  }
  var db = new Connection(dbConfig);
  db.on('connect', function(err) {
    async.series([
      function (callback) {
        //console.log("being")
        var request = new DbRequest(
        "SELECT chat_room.contact_id as contactId, contacts.name as displayName ,max(chat_room.updatetime) as updatetime"+ 
          " FROM line_chat_room chat_room, contacts "+
          "Where chat_room.contact_id = contacts.contact_id and chat_room.contact_id is not null"+
          " group by  chat_room.contact_id, contacts.name", 
        function(err, rowCount , row) {
          if (err) {
            console.log("select line_messages error ",err);
          }      
          callback();
        });

        request.on('row', function(columns) {
          //console.log('-------------------',columns[0])
          var record = {
            "children": []
          };
          columns.forEach(function(column) {
            record[column.metadata.colName] = column.value
          });
          messages.children.push(record)
        });
        db.execSql(request);
        /*
        db.all("SELECT chat_room.contact_id, contacts.name ,max(chat_room.updatetime) as updatetime"+ 
              " FROM chat_room , contacts "+
              "Where chat_room.contact_id = contacts.contact_id"+
              " group by  chat_room.contact_id, contacts.name",
        function(err, rows) {
            //console.log(row.id + ": " , row.replyToken, row.eventType, row.timestamp ,
            //row.sourceType ,row.sourceUserId , row.messageId , row.messageType , 
            //row.messageText,row.info);
            for (var i=0; i<rows.length; i++) {
              var row = rows[i]
              messages.children.push({
                contactId : row.contact_id, 
                displayName : row.name,
                updatetime : row.updatetime,
                "children": []
              })
            }
            callback()
        });
        */
      },
      function (callback) {
        //console.log("messages")
        if (messages.children.length == 0) {
          callback();
          return;
        }
        for (var j=0; j<messages.children.length; j++) {
          if (j == messages.children.length-1) {
            contactRoom (db , messages.children[j], callback ) 
          } else {
            contactRoom (db , messages.children[j], null ) 
          }
        }
      }],function(err) { //This function gets called after the two tasks have called their "task callbacks"
          db.close();
          console.log(err)
          if (err) return next(err);
          //Here locals will be populated with `user` and `posts`
          //Just like in the previous example
          res.json(messages);
      })
  })
});

app.post('/upload', function (req, res) {
  //console.log(req.files);
  //console.log(req.query);
  console.log(req.body);
  var room = {
    id : req.body.id,
    contact_id : req.body.contactId 
  }
  
 
  if (!req.files) {
    res.json({
      success : false,
      msg : 'No files were uploaded.'
    });
    return;
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  var uploadFile = req.files.uploadFile;
  var extension = path.extname(uploadFile.name)

  var time = String(Date.now());
  var fileName = time+extension
  var messageType = 'image';
  var originalContentUrl = "https://limitless-crag-52851.herokuapp.com/content/upload/"+room.id+"/"+fileName;
  var previewImageUrl = "https://limitless-crag-52851.herokuapp.com/content/upload/"+room.id+"/"+fileName;
  var duration = 0;
  if (uploadFile.mimetype.indexOf("video") != -1 ) {
    messageType = 'video';
    previewImageUrl = "https://limitless-crag-52851.herokuapp.com/resources/images/facetime.png";
  } else if (uploadFile.mimetype.indexOf("audio") != -1 ) { 
    messageType = 'audio';
  }
  var messageEv = {
      roomId : req.body.id,
      replyToken: "",
      type : "message",
      timestamp : time,//messageEv.timestamp ,
      sourceType : "agent" ,
      sourceUserId : req.body.userId ,
      contactId : req.body.contactId ,
      "source": {
          "type": "agent",
          "userId": req.body.agentId
      },
      message : {
          id : time ,
          type: messageType,
          filePath : 'content/upload/'+room.id+"/",
          fileName : fileName,
          originalFileName : uploadFile.name,
          originalContentUrl : originalContentUrl,
          previewImageUrl : previewImageUrl,
      }
  }
  var dir = __dirname+'/content/upload/'+room.id+"/";
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }

 
  // Use the mv() method to place the file somewhere on your server 
  uploadFile.mv(dir+fileName, function(err) {
    if (err) {
      res.status(500).send(err);
    }
    else {
        if (messageType == 'audio') {
            messageEv.message.duration = parseInt(req.body.duration)
        }
        var db = new Connection(dbConfig);
        db.on('connect', function(err) {
          if (err) {
              console.log(err)
              return;
          }
          async.series([
            function (callback) {
              var request = new DbRequest(
                "select line_name as lineName, pictureUrl from contact_lines where line_id = @lineId", 
                function(err, rowCount , row) {
                  if (err) {
                    console.log("select line_messages error ",err);
                  }  
                  callback()     
                });

                request.on('row', function(columns) {
                  //console.log('-------------------',columns[0])
                  columns.forEach(function(column) {
                    room[column.metadata.colName] = column.value
                  });
              });
              request.addParameter('lineId', TYPES.VarChar, messageEv.source.userId);
              db.execSql(request);
            },
            function (callback) {
              saveMessage(db , room, messageEv, callback)
            },
            function (callback) {
              var args = {
                headers: { 
                  "Authorization": token,
                  "Content-Type": "application/json" 
                }, // request headers 
                data : {
                  "to": messageEv.sourceUserId,
                  "messages":[messageEv.message]
                }
              };
              client.post("https://api.line.me/v2/bot/message/push", args, 
                function (result, response) {
                  // parsed response body as js object 
                  console.log('result',result);
                  // raw response 
                  //console.log(response);
              });
              
              callback();
            }
          ],function(err) { 
            db.close();
            if (err) return next(err);
            res.json({
              success : true,
              message : messageEv,
              room : room
            });
            //res.send('File uploaded!');
          })
        })
      /*
        var i =0;
        var db = new sqlite3.Database(DATABASE_NAME);
        db.serialize(function() {
          async.series([
            function (callback) {
              saveMessage(db , room, messageEv, callback)
            },
            function (callback) {
              
              var args = {
                headers: { 
                  "Authorization": token,
                  "Content-Type": "application/json" 
                }, // request headers 
                data : {
                  "to": messageEv.sourceUserId,
                  "messages":[messageEv.message]
                }
              };
              client.post("https://api.line.me/v2/bot/message/push", args, 
                function (result, response) {
                  // parsed response body as js object 
                  console.log('result',result);
                  // raw response 
                  //console.log(response);
              });
              
              callback();
            }
          ],function(err) { 
            db.close();
            if (err) return next(err);
            res.json({
              success : true,
              message : messageEv
            });
            //res.send('File uploaded!');
          })
        })
        */
    }
  });
  
  //sleep.sleep(30)
  

})

app.post('/contactUpload', function (req, res) {
  //console.log(req.files);
  //console.log(req.query);
  console.log(req.body);
  var room = {
    id : 0,
    contact_id : req.body.contactId 
  }
 
  if (!req.files) {
    res.json({
      success : false,
      msg : 'No files were uploaded.'
    });
    return;
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  var uploadFile = req.files.uploadFile;
  var extension = path.extname(uploadFile.name)

  var time = String(Date.now());
  var fileName = time+extension
  var messageType = 'image';
  var originalContentUrl = "https://limitless-crag-52851.herokuapp.com/content/upload/"+room.contact_id+"/"+fileName;
  var previewImageUrl = "https://limitless-crag-52851.herokuapp.com/content/upload/"+room.contact_id+"/"+fileName;
  var duration = 0;
  if (uploadFile.mimetype.indexOf("video") != -1 ) {
    messageType = 'video';
    previewImageUrl = "https://limitless-crag-52851.herokuapp.com/resources/images/facetime.png";
  } else if (uploadFile.mimetype.indexOf("audio") != -1 ) { 
    messageType = 'audio';
  }
  var messageEv = {
      roomId : 0,
      replyToken: "",
      type : "message",
      timestamp : time,//messageEv.timestamp ,
      sourceType : "agent" ,
      sourceUserId : req.body.userId ,
      contactId : req.body.contactId ,
      "source": {
          "type": "agent",
          "userId": req.body.agentId
      },
      message : {
          id : time ,
          type: messageType,
          filePath : 'content/upload/'+room.contact_id+"/",
          fileName : fileName,
          originalFileName : uploadFile.name,
          originalContentUrl : originalContentUrl,
          previewImageUrl : previewImageUrl,
      }
  }
  var dir = __dirname+'/content/upload/'+room.contact_id+"/";
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }

 
  // Use the mv() method to place the file somewhere on your server 
  uploadFile.mv(dir+fileName, function(err) {
    if (err) {
      res.status(500).send(err);
    }
    else {
        if (messageType == 'audio') {
            messageEv.message.duration = parseInt(req.body.duration)
        }
        var db = new Connection(dbConfig);
        var lineIds = []
        db.on('connect', function(err) {
          if (err) {
              console.log(err)
              return;
          }
          async.series([
            function (callback) {
              var request = new DbRequest(
                "select line_name as lineName, pictureUrl from contact_lines where line_id = @lineId", 
                function(err, rowCount , row) {
                  if (err) {
                    console.log("select line_messages error ",err);
                  }  
                  callback()     
                });

                request.on('row', function(columns) {
                  //console.log('-------------------',columns[0])
                  columns.forEach(function(column) {
                    room[column.metadata.colName] = column.value
                  });
              });
              request.addParameter('lineId', TYPES.VarChar, messageEv.source.userId);
              db.execSql(request);
            },
            function (callback) {
                var request = new DbRequest(
                  "SELECT line_id "+
                    " FROM contact_lines "+
                    "Where active_flag=1 and contact_id = @contactId", 
                  function(err, rowCount , row) {
                    if (err) {
                      console.log("select line_messages error ",err);
                    }  
                    callback()     
                  });

                  request.on('row', function(columns) {
                    //console.log('-------------------',columns[0])
                    var record = {}
                    columns.forEach(function(column) {
                      record[column.metadata.colName] = column.value
                    });
                    lineIds.push(record.line_id)
                });
                request.addParameter('contactId', TYPES.VarChar, messageEv.contactId);
                db.execSql(request);
            },
            function (callback) {
              saveMessage(db , room, messageEv, callback)
            },
            function (callback) {
              console.log('line ids',lineIds)
              for (var i=0; i<lineIds.length; i++) {
                var args = {
                  headers: { 
                    "Authorization": token,
                    "Content-Type": "application/json" 
                  }, // request headers 
                  data : {
                    "to": lineIds[i],
                    "messages":[messageEv.message]
                  }
                };
                client.post("https://api.line.me/v2/bot/message/push", args, 
                  function (result, response) {
                    // parsed response body as js object 
                    console.log('result',result);
                    // raw response 
                    //console.log(response);
                });
              }
              callback();
            }
          ],function(err) { 
            db.close();
            if (err) return next(err);
            res.json({
              success : true,
              message : messageEv,
              room : room
            });
          });
        });
    }


      /*
        var db = new sqlite3.Database(DATABASE_NAME);
        db.serialize(function() {
          async.series([
            function (callback) {
              db.all("SELECT line_id "+
                    " FROM contact_lines "+
                    "Where active_flag=1 and contact_id = ?",[messageEv.contactId],
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
                    "messages":[messageEv.message]
                  }
                };
                client.post("https://api.line.me/v2/bot/message/push", args, 
                  function (result, response) {
                    // parsed response body as js object 
                    console.log('result',result);
                    // raw response 
                    //console.log(response);
                });
              }
              
              callback();
            }
          ],function(err) { 
            db.close();
            if (err) return next(err);
            res.json({
              success : true,
              message : messageEv
            });
            //res.send('File uploaded!');
          })
        })
        */
  });
  
  //sleep.sleep(30)
  

})

function followHandler(db ,data , cb) {
  if (data.source.type == 'agent') {
      var result = {}
      var request = new DbRequest(
        "select agent_name from agents where agent_id = @agent_id", 
        function(err, rowCount , row) {
          if (err) {
            console.log("select line_messages error ",err);
          }   
          var request = new DbRequest(
            "INSERT INTO contact_lines"+
            "([contact_id],[contact_person_id],[line_id],[line_name],[active_flag]"+
            ",[join_date],[invite_by],[invite_date],statusMessage, pictureUrl, sourceType) "+
            "VALUES (@contact_id, @contact_person_id, @line_id, @line_name, @active_flag"+
            ",@join_date, @invite_by ,@invite_date,@statusMessage, @pictureUrl, @sourceType)",
            function(err, rowCount , row) {
              if (err) {
                console.log("contact_lines error ",err);
              }
              cb();
            });
            
            request.addParameter('contact_id', TYPES.VarChar, null);
            request.addParameter('contact_person_id', TYPES.VarChar, null);
            request.addParameter('line_id', TYPES.VarChar, data.source.userId);
            request.addParameter('line_name', TYPES.NVarChar, result.agent_name);
            request.addParameter('active_flag', TYPES.Char, "1");
            request.addParameter('join_date', TYPES.BigInt, data.timestamp);
            request.addParameter('invite_by', TYPES.VarChar, null);
            request.addParameter('invite_date', TYPES.VarChar, null);
            request.addParameter('statusMessage', TYPES.NVarChar, "");
            request.addParameter('pictureUrl', TYPES.NVarChar, "");
            request.addParameter('sourceType', TYPES.VarChar, data.source.type);
            db.execSql(request);
      });

      request.on('row', function(columns) {
        //console.log('-------------------',columns[0])
        columns.forEach(function(column) {
          result[column.metadata.colName] = column.value
        });
      });
      request.addParameter('agent_id', TYPES.NVarChar, data.source.userId);
      db.execSql(request);
      return;
  }
  var args = {
      headers: { "Authorization": token } // request headers 
  };
  client.get("https://api.line.me/v2/bot/profile/"+data.source.userId, args, 
  function (result, response) {
      // parsed response body as js object 
      console.log('profile ',result);
      async.series([
          function (callback) {
            var request = new DbRequest(
            "select contact_id, contact_person_id from contact_persons where line_name = @line_name and line_id = ''", 
            function(err, rowCount , row) {
              if (err) {
                console.log("select line_messages error ",err);
              }   
              callback();    
            });

            request.on('row', function(columns) {
              //console.log('-------------------',columns[0])
              columns.forEach(function(column) {
                result[column.metadata.colName] = column.value
              });
            });
            request.addParameter('line_name', TYPES.VarChar, result.displayName);
            db.execSql(request);
          },
          function (callback) {
            var request = new DbRequest(
            "INSERT INTO contact_lines"+
            "([contact_id],[contact_person_id],[line_id],[line_name],[active_flag]"+
            ",[join_date],[invite_by],[invite_date],statusMessage, pictureUrl, sourceType) "+
            "VALUES (@contact_id, @contact_person_id, @line_id, @line_name, @active_flag"+
            ",@join_date, @invite_by ,@invite_date,@statusMessage, @pictureUrl, @sourceType)",
            function(err, rowCount , row) {
              if (err) {
                console.log("contact_lines error ",err);
              }
              callback();
            });
            
            request.addParameter('contact_id', TYPES.VarChar, result.contact_id);
            request.addParameter('contact_person_id', TYPES.VarChar, result.contact_person_id);
            request.addParameter('line_id', TYPES.VarChar, data.source.userId);
            request.addParameter('line_name', TYPES.NVarChar, result.displayName);
            request.addParameter('active_flag', TYPES.Char, "1");
            request.addParameter('join_date', TYPES.BigInt, data.timestamp);
            request.addParameter('invite_by', TYPES.VarChar, null);
            request.addParameter('invite_date', TYPES.VarChar, null);
            request.addParameter('statusMessage', TYPES.NVarChar, result.statusMessage);
            request.addParameter('pictureUrl', TYPES.NVarChar, result.pictureUrl);
            request.addParameter('sourceType', TYPES.NVarChar, data.source.type);
            db.execSql(request);
          },
          function (callback) {
              if (result.contact_person_id) {
                  var request = new DbRequest(
                  "update contact_persons set line_id = @line_id where contact_person_id = @contact_person_id",
                  function(err, rowCount , row) {
                    if (err) {
                      console.log("contact_lines error ",err);
                    }
                    callback();
                  });
                  request.addParameter('contact_person_id', TYPES.VarChar, result.contact_person_id);
                  request.addParameter('line_id', TYPES.VarChar, data.source.userId);
                  db.execSql(request);
              } else {
                callback();
              }
          },

          function (callback) {
              if (result.contact_person_id) {
                  var request = new DbRequest(
                  "update line_chat_room set contact_id = @contact_id, contact_person_id = @contact_person_id where userId = @userId",
                  function(err, rowCount , row) {
                    if (err) {
                      console.log("contact_lines error ",err);
                    }
                    callback();
                  });
                  request.addParameter('contact_id', TYPES.VarChar, result.contact_id);
                  request.addParameter('contact_person_id', TYPES.VarChar, result.contact_person_id);
                  request.addParameter('userId', TYPES.VarChar, data.source.userId);
                  db.execSql(request);
              } else {
                callback();
              }
          },

          function (callback) {
            saveNotMessageType(db , data, callback)
          }
      ], function () {
          cb();
      });

  })
}

function contactRoom (db , contact, callback ) {
    var request = new DbRequest(
      "SELECT id AS id, sourceType,userId ,contact_id, contact_person_id, displayName, pictureUrl,"+ 
      "statusMessage, messageType, message ,createtime, updatetime, active_flag FROM line_chat_room "+
      "where contact_id = @contactId", 
      function(err, rowCount , row) {
        if (err) {
          console.log("select line_messages error ",err);
        }      
        if (callback) callback()
    });
    request.on('row', function(columns) {
        //console.log('-------------------',columns[0])
        var record = {
          "children": []
        };
        columns.forEach(function(column) {
          record[column.metadata.colName] = column.value
        });
        record.contactId = record.contact_id, 
        record.contactPersonId = record.contact_person_id,
        record.icon = record.pictureUrl+"/small" ,
        record.cls = 'leaf-icon',
        record.leaf = true

        contact.children.push(record)
    });
    request.addParameter('contactId', TYPES.VarChar, contact.contactId);
    db.execSql(request);      
          
  /*
    db.all("SELECT rowid AS id, sourceType,userId ,contact_id, contact_person_id, displayName, pictureUrl,"+ 
      "statusMessage, messageType, message ,createtime, updatetime, active_flag FROM chat_room "+
      "where contact_id = ?",[contact.contactId],
    function(err, rows) {
        //console.log(row.id + ": " , row.replyToken, row.eventType, row.timestamp ,
        //row.sourceType ,row.sourceUserId , row.messageId , row.messageType , 
        //row.messageText,row.info);
        for (var i=0; i<rows.length; i++) {
          var row = rows[i]
          contact.children.push({
            id : row.id,
            userId: row.userId,
            contact_id : row.contact_id, 
            contact_person_id : row.contact_person_id,
            contactId : row.contact_id, 
            contactPersonId : row.contact_person_id,
            displayName : row.displayName,
            pictureUrl : row.pictureUrl ,
            icon : row.pictureUrl+"/small" ,
            cls : 'leaf-icon',
            statusMessage : row.statusMessage ,
            message : row.message ,
            messageType : row.messageType,
            messageText : row.message ,
            sourceType : row.sourceType,
            createtime : row.createtime ,
            updatetime : row.updatetime ,
            active_flag : row.active_flag,
            "leaf": true
          })
        }
        if (callback) callback()
    });
    */
}

function messageHandler(db ,data , cb) {
  if (data.message.type == 'text') {
    if (data.message.text == 'สอบถาม'||data.message.text.toLowerCase() == 'menu') {
      replyMessage(data);
    }
  }
  var room = {};
  var request = new DbRequest("SELECT top 1 * FROM line_chat_room where userId = @userId and active_flag='1'", 
    function(err, rowCount , row) {
      if (err) {
        console.log("chat_room error ",err);
        cb();
        return;
      } else {
        console.log("chat_room result ",rowCount + ' rows');
        //console.log("chat_room row ",row);
        if (rowCount > 0) {
            console.log("update chat_room value ",room);
            updateRoom(db, room, data, cb);
        } else {
            createRoom(db, room, data, cb);
        }
      }

    });

    request.on('row', function(columns) {
      //console.log('-------------------',columns[0])
      columns.forEach(function(column) {
        room[column.metadata.colName] = column.value
        //console.log(column.metadata.colName,column.value);
      });
    });
    
    request.addParameter('userId', TYPES.VarChar, data.source.userId);
    db.execSql(request);

    /*
  db.get("SELECT rowid AS id, * FROM chat_room where userId = ? and active_flag=1 LIMIT 1", [data.source.userId],
    function(err, row){
      var exists = true;
      var messageEv = data;
      if(err) throw err;
      var room = {};
      if(typeof row == "undefined") {
          exists = false;
      } else {
          room = row
          console.log("row is: ", row);
      }
      console.log("## Is Room exists",exists)
      if (exists) {
        updateRoom(room, messageEv);
      } else {
        createRoom(room, messageEv);
      }    
  });
  */
}

function createRoom(db, room, messageEv, cb) {
  var args = {
      headers: { "Authorization": token } // request headers 
  };
  client.get("https://api.line.me/v2/bot/profile/"+messageEv.source.userId, args, 
  function (result, response) {
      // parsed response body as js object 
      console.log('profile ',result);
      // raw response 
      //console.log(response);
      async.series([
        function (callback) {
          var request = new DbRequest(
            "SELECT top 1 contact_lines.id AS id, "+
                  "contact_lines.contact_id , "+
                  "contact_lines.contact_person_id , "+
                  "contact_lines.line_id ,"+
                  "contact_lines.line_name, "+
                  "contacts.name as contactName "+
                  "FROM contact_lines, contacts "+
                  "where contact_lines.contact_id = contacts.contact_id "+
                  "and contact_lines.line_id = @line_id "+
                  "and contact_lines.active_flag=1",
                function(err, rowCount , row) {
                  if (err) {
                    console.log("function 1 error ",err);
                    throw err;
                  } else {
                    console.log("function 1  result ",rowCount + ' rows');
                    console.log("function 1  row ",row);
                    if (rowCount == 0) {
                        room.contact_id = null
                        room.contact_person_id = null
                        room.line_id = null
                        room.line_name = null
                        room.contactName = null
                    } else {
                        room.contact_id = row.contact_id
                        room.contact_person_id = row.contact_person_id
                        room.line_id = row.line_id
                        room.line_name = row.line_name
                        room.contactName = row.contactName
                    }
                  }
                  callback();
                });
                request.addParameter('line_id', TYPES.VarChar, messageEv.source.userId);
                db.execSql(request);

                /*
          db.get("SELECT contact_lines.rowid AS id, "+
                  "contact_lines.contact_id , "+
                  "contact_lines.contact_person_id , "+
                  "contact_lines.line_id ,"+
                  "contact_lines.line_name, "+
                  "contacts.name as contactName "+
                  "FROM contact_lines, contacts "+
                  "where contact_lines.contact_id = contacts.contact_id "+
                  "and contact_lines.line_id = ? "+
                  "and contact_lines.active_flag=1 LIMIT 1", [messageEv.source.userId],
            function(err, row){
              if(err) throw err;
              if(typeof row == "undefined") {
                  room.contact_id = null
                  room.contact_person_id = null
                  room.line_id = null
                  room.line_name = null
                  room.contactName = null
              } else {
                  room.contact_id = row.contact_id
                  room.contact_person_id = row.contact_person_id
                  room.line_id = row.line_id
                  room.line_name = row.line_name
                  room.contactName = row.contactName
              }
              callback();
            });
            */
        },

        function (callback) {
            console.log("Insert  line_chat_room", [room.id,messageEv.source.userId,"","","",1]);
            var request = new DbRequest(
            "INSERT INTO line_chat_room "+
            "(userId ,contact_id, contact_person_id, sourceType, displayName, pictureUrl, statusMessage, active_flag) values "+
            "(@userId ,@contact_id, @contact_person_id, @sourceType, @displayName, @pictureUrl, @statusMessage, @active_flag);"+
            "select @@identity",
                function(err, rowCount , row) {
                  if (err) {
                    console.log("function 2 error ",err);
                    throw err;
                  }
                  callback();
                });
              request.on('row', function(columns) {
                  //console.log("function 2  row ",columns);
                  room.id = columns[0].value;
                  console.log("lastID",columns[0].value)
              });
              request.addParameter('userId', TYPES.VarChar, messageEv.source.userId);
              request.addParameter('contact_id', TYPES.VarChar, room.contact_id);
              request.addParameter('contact_person_id', TYPES.VarChar, room.contact_person_id);
              request.addParameter('sourceType', TYPES.VarChar, messageEv.source.type);
              request.addParameter('displayName', TYPES.NVarChar, "");
              request.addParameter('pictureUrl', TYPES.NVarChar, "");
              request.addParameter('statusMessage', TYPES.NVarChar, "");
              request.addParameter('active_flag', TYPES.Char, '1');
              db.execSql(request);

          /*
            db.run("INSERT INTO chat_room "+
              "(userId ,contact_id, contact_person_id, sourceType, displayName, pictureUrl, statusMessage, active_flag) "+
              "select ?, ?, ?, ?, ?, ?, ?, ? WHERE NOT EXISTS(SELECT 1 FROM chat_room WHERE userId = ? and active_flag=1)",
            [messageEv.source.userId, room.contact_id, room.contact_person_id, messageEv.source.type, "", "", "" , 1, messageEv.source.userId],
            function () {
              room.id = this.lastID;
              console.log("lastID",this.lastID)
              callback();
            })
          */
        },
        function (callback) {
            saveMessage(db , room, messageEv, callback)
        },

        function (callback) {
            console.log("Update line_chat_room", [result.displayName, result.pictureUrl,result.statusMessage ,messageEv.source.userId]);
            var messageText = getMessageText(messageEv);
            var request = new DbRequest(
              "update line_chat_room set "+
              "displayName = @displayName"+
              ",pictureUrl = @pictureUrl"+
              ",statusMessage = @statusMessage"+
              ",messageType = @messageType "+
              ",message = @message "+
              ",createtime = @createtime "+
              "WHERE userId = @userId and active_flag='1'",
                function(err, rowCount , row) {
                  if (err) {
                    console.log("function 3 error ",err);
                    throw err;
                  }
                  io.emit('newroom', {
                      id : room.id,
                      userId: messageEv.source.userId,
                      contactId : room.contact_id, 
                      contactName : room.contactName, 
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
                      lineName : result.displayName,
                      filePath : messageEv.message.filePath,
                      fileName : messageEv.message.fileName,
                      active_flag : 1
                  });
                  callback();                  
                });
              request.addParameter('displayName', TYPES.NVarChar, result.displayName);
              request.addParameter('pictureUrl', TYPES.NVarChar, result.pictureUrl);
              request.addParameter('statusMessage', TYPES.NVarChar, result.statusMessage);
              request.addParameter('messageType', TYPES.VarChar, messageEv.message.type);
              request.addParameter('message', TYPES.NVarChar, messageText);
              request.addParameter('createtime', TYPES.BigInt, messageEv.timestamp);
              request.addParameter('userId', TYPES.VarChar, messageEv.source.userId);
              db.execSql(request);    

            /*
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
              messageText, messageEv.timestamp, messageEv.source.userId],
              function() {
                io.emit('newroom', {
                    id : room.id,
                    userId: messageEv.source.userId,
                    contactId : room.contact_id, 
                    contactName : room.contactName, 
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
              });
          */
        }
      ],function(err) { //This function gets called after the two tasks have called their "task callbacks"
        cb();
        if (err) {
          return next(err);
        }
      })
    })

}

function updateRoom(db, room, messageEv, cb) {
    console.log("UpdateRoom Update line_chat_room", [messageEv.message.text, messageEv.timestamp, messageEv.source.userId]);
    async.series([
      function (callback) {
        if (room.lineName)  {
          callback();
          return;
        }
        var request = new DbRequest(
          "select line_name as lineName, pictureUrl from contact_lines where line_id = @lineId", 
          function(err, rowCount , row) {
            if (err) {
              console.log("select line_messages error ",err);
            }  
            callback()     
          });

          request.on('row', function(columns) {
            //console.log('-------------------',columns[0])
            columns.forEach(function(column) {
              room[column.metadata.colName] = column.value
            });
        });
        request.addParameter('lineId', TYPES.VarChar, messageEv.source.userId);
        db.execSql(request);
      },

      function (callback) {
        saveMessage(db , room, messageEv, callback)
      },
      function (callback) {
        //console.log("###############------- ############## wat")
        var messageText = getMessageText(messageEv);
        var request = new DbRequest(
           "update line_chat_room set "+
              "messageType = @messageType "+
              ",message = @message "+
              ",sourceType = @sourceType "+
              ",updatetime = @updatetime "+
              "WHERE userId = @userId and active_flag='1'",
              function(err, rowCount , row) {
                if (err) {
                  console.log("UpdateRoom error ",err);
                  throw err;
                }
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
                  pictureUrl : room.pictureUrl,
                  filePath : messageEv.message.filePath,
                  fileName : messageEv.message.fileName,
                  lineName : room.lineName
                });
                callback();                  
              });
              request.addParameter('messageType', TYPES.VarChar, messageEv.message.type);
              request.addParameter('message', TYPES.NVarChar, messageText);
              request.addParameter('sourceType', TYPES.NVarChar, messageEv.source.type);
              request.addParameter('updatetime', TYPES.BigInt, messageEv.timestamp);
              request.addParameter('userId', TYPES.VarChar, messageEv.source.userId);
              db.execSql(request);   

      /*              
        db.run("update chat_room set "+
              "messageType = ? "+
              ",message = ? "+
              ",sourceType = ? "+
              ",updatetime = ? "+
              "WHERE userId = ? and active_flag=1",
        [messageEv.message.type, messageText, messageEv.source.type, 
        messageEv.timestamp, messageEv.source.userId],
        function(err) {
          callback();
          //console.log("############################# wat")
          if (err) console.log("err",err)
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
        });
        */
      }
    ],function(err) { 
      cb();
      if (err) return next(err);
    })
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
    } else if (messageEv.message.type == 'file'){
      return "send you a sticker"
    }
}

function saveMessage(db , room, messageEv, callback) {
  console.log("SaveMessage INSERT INTO line_messages ",
              [room.id, messageEv.replyToken, messageEv.type, 
              messageEv.timestamp,messageEv.source.type,messageEv.source.userId,
              messageEv.message.id, messageEv.message.type, messageEv.message.text]);
    var request = new DbRequest(
      "INSERT INTO line_messages "+
      "(roomId ,replyToken ,eventType ,timestamp ,sourceType ,"+
      "contact_id, sourceUserId , messageId ,messageType , "+
      "messageText, stickerId, packageId, "+
      "title, address, latitude, longitude, "+
      "filePath, fileName, originalFileName, "+
      "info) "+ 
      "VALUES (@roomId ,@replyToken ,@eventType ,@timestamp ,@sourceType ,"+
      "@contact_id, @sourceUserId , @messageId ,@messageType , "+
      "@messageText, @stickerId, @packageId, "+
      "@title, @address, @latitude, @longitude, "+
      "@filePath, @fileName, @originalFileName, "+
      "@info)",
      function(err, rowCount , row) {
        if (err) {
          console.log("INSERT messages  error ",err);
          throw err;
        }

        if (messageEv.source.type == 'agent') {
          callback();
          return;
        }
        var isContent = messageEv.message.type == 'image' || messageEv.message.type == 'audio' ||
                        messageEv.message.type == 'video' || messageEv.message.type == 'file'
        if (isContent) {
          var dir = __dirname+'/'+messageEv.message.filePath;
          if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
          }
          var args = {
          headers: { "Authorization": token } // request headers 
          };
          client.get("https://api.line.me/v2/bot/message/"+messageEv.message.id+"/content", args, 
          function (result, response) {
              fs.writeFile(dir+messageEv.message.fileName, result, 'binary', 
              function(err){
                  if (err) throw err
                  console.log('File saved.')
                  callback();
              })
          });
        } else {
          callback();
        }
     });

    if (messageEv.source.type == 'user') {
        if (messageEv.message.type == 'image') {
          messageEv.message.filePath = 'content/images/'+room.id+"/"
          messageEv.message.fileName = messageEv.message.id+'.png'
        } else if (messageEv.message.type == 'audio') {
          messageEv.message.filePath = 'content/audios/'+room.id+"/"
          messageEv.message.fileName = messageEv.message.id+'.mp4'
        } else if (messageEv.message.type == 'video') {
          messageEv.message.filePath = 'content/videos/'+room.id+"/"
          messageEv.message.fileName = messageEv.message.id+'.mp4'
        } else if (messageEv.message.type == 'file') {
          messageEv.message.filePath = 'content/files/'+room.id+"/"
          messageEv.message.fileName = messageEv.message.id+path.extname(messageEv.message.fileName)
          messageEv.message.originalFileName = messageEv.message.fileName;
        }
    }
    request.addParameter('roomId', TYPES.Int, room.id);
    request.addParameter('replyToken', TYPES.VarChar, messageEv.replyToken);
    request.addParameter('eventType', TYPES.VarChar, messageEv.type);
    request.addParameter('timestamp', TYPES.BigInt, messageEv.timestamp);
    request.addParameter('sourceType', TYPES.VarChar, messageEv.source.type);
    request.addParameter('contact_id', TYPES.VarChar, room.contact_id || null);
    request.addParameter('sourceUserId', TYPES.VarChar, messageEv.source.userId);
    request.addParameter('messageId', TYPES.VarChar, messageEv.message.id);
    request.addParameter('messageType', TYPES.VarChar, messageEv.message.type);
    request.addParameter('messageText', TYPES.NVarChar, messageEv.message.text);
    request.addParameter('stickerId', TYPES.Int, messageEv.message.type == 'sticker'? messageEv.message.stickerId : 0);
    request.addParameter('packageId', TYPES.Int, messageEv.message.type == 'sticker'? messageEv.message.packageId : 0);
    request.addParameter('title', TYPES.NVarChar, messageEv.message.type == 'location'? messageEv.message.title : "");
    request.addParameter('address', TYPES.NVarChar, messageEv.message.type == 'location'? messageEv.message.address : "");
    request.addParameter('latitude', TYPES.VarChar, messageEv.message.type == 'location'? messageEv.message.latitude : "");
    request.addParameter('longitude', TYPES.VarChar, messageEv.message.type == 'location'? messageEv.message.longitude : "");
    request.addParameter('filePath', TYPES.NVarChar, messageEv.message.filePath);
    request.addParameter('fileName', TYPES.NVarChar, messageEv.message.fileName);
    request.addParameter('originalFileName', TYPES.NVarChar, messageEv.message.originalFileName);
    request.addParameter('info', TYPES.NVarChar, JSON.stringify(messageEv));
    db.execSql(request);

    /*
    var stmt = db.prepare("INSERT INTO messages "+
      "(roomId ,replyToken ,eventType ,timestamp ,sourceType ,"+
      "contact_id, sourceUserId , messageId ,messageType , "+
      "messageText, stickerId, packageId, "+
      "title, address, latitude, longitude, "+
      "filePath, fileName, originalFileName, "+
      "info) "+ 
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?)");

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
              messageEv.message.filePath,
              messageEv.message.fileName,
              messageEv.message.originalFileName,
              JSON.stringify(messageEv)],
      function(err) {
        if (err) console.log("err",err)
        if (messageEv.source.type == 'agent') {
          callback();
          return;
        }
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
    });
    
    stmt.finalize();
    */
    

}

function saveNotMessageType(db , data, callback) {
    var request = new DbRequest(
    "INSERT INTO line_messages "+
    "(replyToken ,eventType ,timestamp ,sourceType ,sourceUserId ,info) "+ 
    "VALUES (@replyToken ,@eventType ,@timestamp ,@sourceType ,@sourceUserId ,@info)",
    function(err, rowCount) {
        if (err) {
            console.log("insert line_messages error : "+err);
        } else {
            console.log("insert line_messages success :" +rowCount + ' rows');
        }
        callback();
    }); 
    request.addParameter('replyToken', TYPES.VarChar, data.replyToken);
    request.addParameter('eventType', TYPES.VarChar, data.type);
    request.addParameter('timestamp', TYPES.BigInt, data.timestamp);
    request.addParameter('sourceType', TYPES.VarChar, data.source.type);
    request.addParameter('sourceUserId', TYPES.VarChar, data.source.userId);
    request.addParameter('info', TYPES.Text, JSON.stringify(data));
    db.execSql(request);
    console.log("INSERT INTO messages ",
                [data.replyToken, data.type, 
                data.timestamp,data.source.type,data.source.userId],JSON.stringify(data));

}

function replyMessage(data) {
  //console.log('replyMessage',data)
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