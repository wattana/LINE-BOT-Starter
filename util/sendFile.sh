curl -H "Content-Type: application/json" -X POST -d '{
  "events": [
    {
      "type":"message",
      "replyToken":"af267338b08e4418980660b1b135dd3b",
      "source":{
        "userId":"Uaa89e07dfe96f3b66fe7937cf9e2c591",
        "type":"user"
      },
      "timestamp":1486362617152,
      "message":{
        "type":"file",
        "id":"5607484349649",
        "fileName":"_0032339347_0240712504.pdf",
        "fileSize":294236
      }
    }
  ]
}' http://localhost:3000/message