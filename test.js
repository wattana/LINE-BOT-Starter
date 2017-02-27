var express  = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var client = new Client();
var request = require('request');
var fs = require('fs');

router.get('/listContactPerson', function(req, res, next) {
  var args = {
      headers: { 
        "Authorization": "token",
        "Content-Type": "application/json" 
      }, // request headers 
      data :   {
        contactId : '489057F9-1F48-49B6-9464-BD2247C23642'
    }
  };
  client.post("https://imind.ibss.co.th/Line.WebService/LineService.asmx/listContactPerson", args, 
  function (result, response) {
    // parsed response body as js object 
    console.log('result',result);
    // raw response 
    //console.log(response);
    res.send(result)
  });
    //res.send('Test sendText success\n')
});

router.get('/sendText', function(req, res, next) {
  var args = {
      headers: { 
        "Authorization": "token",
        "Content-Type": "application/json" 
      }, // request headers 
      data :   {
        agentId: 'FF50CE0C-4119-490A-B1E8-B109571374C8',
        contactId : '489057F9-1F48-49B6-9464-BD2247C23642',
        contactPersonId : 'FE27D924-DEAF-4657-B6BB-01ECFF37A716',
        text : 'test'
    }
  };
  client.post("http://vm:46233/lineservice.asmx/sendText", args, 
  function (result, response) {
    // parsed response body as js object 
    console.log('result',result);
    // raw response 
    //console.log(response);
    res.send(result)
  });
    //res.send('Test sendText success\n')
});

router.get('/sendImage', function(req, res, next) {
    var formData = {
        // Pass a simple key-value pair 
        agentId: 'FF50CE0C-4119-490A-B1E8-B109571374C8',
        contactId : '489057F9-1F48-49B6-9464-BD2247C23642',
        contactPersonId : 'FE27D924-DEAF-4657-B6BB-01ECFF37A716',
        // Pass data via Streams 
        imageFile: fs.createReadStream(__dirname + '/resources/images/example.jpg')
    };
    /*
    request({
        uri:'http://vm:46233/lineservice.asmx/sendImage',
        method: 'POST',
        json:{
            "requestId" : "10",
            imageFile: fs.createReadStream(__dirname + '/resources/images/example.jpg')
        },
        /
        multipart: [
        {
            'content-type': 'application/json',
            body: JSON.stringify({foo: 'bar', _attachments: {'message.txt': {follows: true, length: 18, 'content_type': 'text/plain' }}})
        },
        { body: 'I am an attachment' },
        { body: fs.createReadStream(__dirname + '/resources/images/example.jpg') }
        ],
        /
        //formData: formData
    }, 
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // Show the HTML for the Google homepage. 
        }
        console.log(body) // Show the HTML for the Google homepage. 
        res.send('Upload successful!  Server responded with:')
    })
    */
    
    request.post({
        url:'http://vm:46233/lineservice.asmx/sendImage', 
        headers : {
            "ContentType" : 'application/json'
        },
        formData: formData
    }, 
        function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log('Upload successful!  Server responded with:', body);
        res.send('Upload successful!  Server responded with:'+ body)
    });
    

/*
    request({
        preambleCRLF: true,
        postambleCRLF: true,
        json : true,
        uri: 'http://vm:46233/lineservice.asmx/sendImage',
        multipart: [
        {
            'content-type': 'application/json',
            body: JSON.stringify({foo: 'bar', _attachments: {'message.txt': {follows: true, length: 18, 'content_type': 'text/plain' }}})
        },
        { body: 'I am an attachment' },
        { body: fs.createReadStream(__dirname + '/resources/images/example.jpg') }
        ],
        // alternatively pass an object containing additional options 
        multipart: {
        chunked: false,
        data: [
            {
            'content-type': 'application/json',
            body: JSON.stringify({foo: 'bar', _attachments: {'message.txt': {follows: true, length: 18, 'content_type': 'text/plain' }}})
            },
            { body: 'I am an attachment' }
        ]
        }
    },
    function (error, response, body) {
        if (error) {
        return console.error('upload failed:', error);
        }
        console.log('Upload successful!  Server responded with:', body);
        res.send('Upload successful!  Server responded with:'+ body)
    })
    */
    
});

module.exports = router;