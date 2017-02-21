var express  = require('express');
var router = express.Router();
var pjson = require('./package.json');
var soap = require('soap');
var WebServiceURL =  pjson.webServiceURL;
var WebHookBaseURL =  pjson.webHookBaseURL;

router.get('/attachment', function(req, res, next) {
    //console.log("username", username)
    var url = WebServiceURL+'requestsservice.asmx?WSDL';
    soap.createClient(url, function(err, client) {
        if (err) {
            return done(err);
        }
        client.download({
            attachmentId : req.query.id
        }, function(err, result) {
            //console.log("login result", result)
            if (result.downloadResult.success) {
                res.writeHead(200, {
                    "Content-Type": result.downloadResult.fileType,
                    "Content-Disposition" : "inline; filename=" + result.downloadResult.fileName
                });
                res.end(new Buffer(result.downloadResult.bytes, 'base64'))
            } else {
                res.send(result)
            }
        });
    });
  
});

module.exports = router;