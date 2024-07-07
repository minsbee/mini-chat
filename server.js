import express from 'express';
import { Server } from "socket.io";
import * as http from 'http';
import ViteExpress from 'vite-express';

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});


io.on('connection', client => {
    const user = client.handshake.query.username;
    
  console.log(`${user} connected`);
  
    client.on('disconnect', () => {
        console.log(`${user} disconnected`);
    });
});
    
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/ message", (_, res) => {
  res.send("message from server");
});


ViteExpress.bind(app, server);