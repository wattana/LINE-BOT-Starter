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
        "id": "5494250043937",
        "type": "location",
        "title": "my location",
        "address": "195 Ratchadaphisek Road Khwaeng Chom Phon, Khet Chatuchak, Krung Thep Maha Nakhon 10900",
        "latitude": 13.825935817519992,
        "longitude": 100.57014752179384
      }
    }   
  ]
}' http://localhost:3000/message