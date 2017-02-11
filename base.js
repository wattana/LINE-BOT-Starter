var express  = require('express');
var router = express.Router();
var pjson = require('./package.json');
var dbConfig = pjson.db;
var Connection = require('tedious').Connection;
var DbRequest = require('tedious').Request;
var TYPES = require('tedious').TYPES;

// invoked for any requested passed to this router
router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1841');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// will handle any request that ends in /events
// depends on where the router is "use()'d"
router.post('/appInfo', function(req, res, next) {
  var db = new Connection(dbConfig);

    db.on('connect', function(err) {
        // If no error, then good to go...
        var info = {}
        var request = new DbRequest(
          "select * from line_contacts where line_id = @lineId", 
          function(err, rowCount , row) {
            if (err) {
              console.log("select line_messages error ",err);
            }  
            if (rowCount == 0){
                agentDummy(db, res)
            } else {
                db.close();
                res.json(info);
            }
          });

        request.on('row', function(columns) {
            //console.log('-------------------',columns[0])
            columns.forEach(function(column) {
              info[column.metadata.colName] = column.value
            });
        });
        request.addParameter('lineId', TYPES.VarChar, "AB30D036-5F28-44B4-9138-59A09DC49A5A");
        db.execSql(request);
    });

});

function agentDummy(db , res) {
    var info = {
        "contact_id":null,
        "contact_person_id":null,
        "line_id":"AB30D036-5F28-44B4-9138-59A09DC49A5A",
        "line_name":"agentt1",
        "sourceType":"agent",
        "statusMessage":"",
        "pictureUrl":"",
        "active_flag":"1",
        "join_date":"1462629479859",
        "invite_by":null,
        "invite_date":null
    }
    var request = new DbRequest(
    "INSERT INTO line_contacts"+
    "([contact_id],[contact_person_id],[line_id],[line_name],[active_flag]"+
    ",[join_date],[invite_by],[invite_date],statusMessage, pictureUrl, sourceType) "+
    "VALUES (@contact_id, @contact_person_id, @line_id, @line_name, @active_flag"+
    ",@join_date, @invite_by ,@invite_date,@statusMessage, @pictureUrl, @sourceType);select @@identity",
    function(err, rowCount , row) {
        if (err) {
            console.log("line_contacts error ",err);
        }
        db.close();
        res.json(info);
    });
    request.on('row', function(columns) {
        //console.log("function 2  row ",columns);
        info.id = columns[0].value;
    });
    
    request.addParameter('contact_id', TYPES.VarChar, info.contact_id);
    request.addParameter('contact_person_id', TYPES.VarChar, info.contact_person_id);
    request.addParameter('line_id', TYPES.VarChar, info.line_id);
    request.addParameter('line_name', TYPES.NVarChar, info.line_name);
    request.addParameter('active_flag', TYPES.Char, info.active_flag);
    request.addParameter('join_date', TYPES.BigInt, info.timestamp);
    request.addParameter('invite_by', TYPES.VarChar, info.invite_by);
    request.addParameter('invite_date', TYPES.VarChar, info.invite_date);
    request.addParameter('statusMessage', TYPES.NVarChar, info.statusMessage);
    request.addParameter('pictureUrl', TYPES.NVarChar, info.pictureUrl);
    request.addParameter('sourceType', TYPES.VarChar, info.sourceType);
    db.execSql(request);
}

module.exports = router;