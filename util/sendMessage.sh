curl -H "Content-Type: application/json" -X POST -d '{
  "events": [
    {
      "replyToken": "079a4d9bb8724be19e21e31d6ae2f26d",
      "type": "message",
      "timestamp": 1462629479859,
      "source": {
        "type": "user",
        "userId": "Uaa89e07dfe96f3b66fe7937cf9e2c591"
      },
      "message": {
        "id": "325708",
        "type": "text",
        "text": "Hello, world"
      }
    },
    {
      "replyToken": "079a4d9bb8724be19e21e31d6ae2f26d",
      "type": "follow",
      "timestamp": 1462629479859,
      "source": {
        "type": "user",
        "userId": "Uaa89e07dfe96f3b66fe7937cf9e2c591"
      }
    }
  ]
}' http://localhost:3000/message
