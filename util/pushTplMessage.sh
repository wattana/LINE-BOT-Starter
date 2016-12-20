curl -X POST -H 'Content-Type:application/json' -H 'Authorization: Bearer {MVJYNb3LtA+efs7m5jbcxhIEeuMekIwto3kLBtF6qUwpykvpvSqqJSKFuHzDJf5tKklfG+BFSx0zuEAG0zFv8IU+tM8tOTUG0uU0Q3lJ/xWg3shdp/wUnph+j+tvIHRfE1zac0+dCe1tFNFbztgKqQdB04t89/1O/w1cDnyilFU=}' -d '{
    "to": "Uaa89e07dfe96f3b66fe7937cf9e2c591",
    "messages":[
        {
            "type": "template",
            "altText": "this is a buttons template",
            "template": {
                "type": "buttons",
                "thumbnailImageUrl": "https://example.com/bot/images/image.jpg",
                "title": "Menu",
                "text": "Please select",
                "actions": [
                    {
                        "type": "postback",
                        "label": "Buy",
                        "data": "action=buy&itemid=123"
                    },
                    {
                        "type": "postback",
                        "label": "Add to cart",
                        "data": "action=add&itemid=123"
                    },
                    {
                        "type": "uri",
                        "label": "View detail",
                        "uri": "http://example.com/page/123"
                    }
                ]
            }
        }
    ]
}' https://api.line.me/v2/bot/message/push