const fs = require('fs');

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Enter Message</title></head>');
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    );
    res.write('</html>');
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', chunk => {
      body.push(chunk);
    });
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFile('message.txt', message, err => {
        if (!err) {
          res.statusCode = 302;
          res.setHeader('Location', '/');
          return res.end();
        } else {
          res.statusCode = 500;
          return res.end('Error writing to file');
        }
      });
    });
  }

  if (url === '/message' && method === 'GET') {
    fs.readFile('message.txt', 'utf8', (err, data) => {
      if (!err && data) {
        res.setHeader('Content-Type', 'text/plain');
        res.write(data);
        return res.end();
      } else {
        res.statusCode = 404;
        return res.end('File not found');
      }
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title></head>');
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
  res.write('</html>');
  res.end();
};

module.exports = requestHandler;
