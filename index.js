var http = require('http');

http.createServer(function(request, response) {
  if (request.method === 'GET' && request.url === '/echo') {
    var body = [];
    request.on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(body).toString();
      response.end("Data is :"+body);
    })
  } else {
    response.end("Hello world ");
  }
}).listen(3000);