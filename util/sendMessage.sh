curl -H "Content-Type: application/json" -X POST -d '{
  "events": [
    {
      "replyToken": "ad0d847dcfa342da89c795a5c8b7ca2c",
      "type": "message",
      "timestamp": 1462629479859,
      "source": {
        "type": "user",
        "userId": "Uaa89e07dfe96f3b66fe7937cf9e2c591"
      },
      "message": {
        "id": "325708",
        "type": "text",
        "text": "menu"
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
        "id": "325708",
        "type": "sticker",
        "packageId": "1",
        "stickerId": "1"
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
