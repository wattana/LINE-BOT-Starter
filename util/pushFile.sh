curl -X POST -H 'Content-Type:application/json' -H 'Authorization: Bearer {MVJYNb3LtA+efs7m5jbcxhIEeuMekIwto3kLBtF6qUwpykvpvSqqJSKFuHzDJf5tKklfG+BFSx0zuEAG0zFv8IU+tM8tOTUG0uU0Q3lJ/xWg3shdp/wUnph+j+tvIHRfE1zac0+dCe1tFNFbztgKqQdB04t89/1O/w1cDnyilFU=}' -d '{
    "to": "Uaa89e07dfe96f3b66fe7937cf9e2c591",
    "messages":[
        {
            "type":"file",
            "fileName":"Hello.pdf",
            "originalContentUrl" : "https://example.com/original.jpg",
            "contentId" : 5607484349649,
            "fileSize" : 33300
        }
    ]
}' https://api.line.me/v2/bot/message/push