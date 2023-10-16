const http = require('http');
const requestHandler = require('./routes');

console.log(requestHandler.someText);

const server = http.createServer(requestHandler);

server.listen(8081);

