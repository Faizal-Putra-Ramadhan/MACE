import http from 'http';

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Dummy Frontend Server\n');
});

server.listen(port, () => {
  console.log(`Dummy server listening on port ${port}`);
});
