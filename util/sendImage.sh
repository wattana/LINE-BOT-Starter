curl -H "Content-Type: application/json" -X POST -d '{
  "events": [
    {
      "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
      "type": "message",
      "timestamp": 1462629479859,
      "source": {
        "type": "user",
        "userId": "Ud674cfc68c5b8a10dd4799279e73a5c3"
      },
      "message": {
        "id": "5491950525289",
        "type": "image"
      }
    }
  ]
}' http://localhost:3000/message