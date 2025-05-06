import http from 'http';
import { app } from './app';
import { setUpSocket } from './socket';

const server = http.createServer(app);
setUpSocket(server);

server.listen(80, () => {
  console.log('Server running at http://localhost');
});
