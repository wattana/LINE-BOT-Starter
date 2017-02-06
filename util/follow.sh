curl -H "Content-Type: application/json" -X POST -d '{
  "events": [
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
      "replyToken": "079a4d9bb8724be19e21e31d6ae2f26d",
      "type": "follow",
      "timestamp": 1462629479859,
      "source": {
        "type": "user",
        "userId": "Ude781d6846f10928b51872c5634a88be"
      }
    }
  ]
}' http://localhost:3000/message
curl -H "Content-Type: application/json" -X POST -d '{
  "events": [
    {
      "replyToken": "079a4d9bb8724be19e21e31d6ae2f26d",
      "type": "follow",
      "timestamp": 1462629479859,
      "source": {
        "type": "user",
        "userId": "Ud674cfc68c5b8a10dd4799279e73a5c3"
      }
    }
  ]
}' http://localhost:3000/message

curl -H "Content-Type: application/json" -X POST -d '{
  "events": [
    {
      "replyToken": "079a4d9bb8724be19e21e31d6ae2f26d",
      "type": "follow",
      "timestamp": 1462629479859,
      "source": {
        "type": "agent",
        "userId": "AB30D036-5F28-44B4-9138-59A09DC49A5A"
      }
    }
  ]
}' http://localhost:3000/message
