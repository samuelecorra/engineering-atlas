import net from 'node:net';
// Loopback only, OS-assigned port; never contacts an external service.
const server = net.createServer(socket => socket.end('atlas local fixture\n'));
server.listen(0, '127.0.0.1', () => console.log(JSON.stringify({ pid: process.pid, address: '127.0.0.1', port: server.address().port })));
setTimeout(() => server.close(), 45000).unref();
process.on('SIGINT', () => server.close());
