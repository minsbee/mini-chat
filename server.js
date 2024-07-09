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
    console.log(client.handshake.query);
    
    const user = client.handshake.query.username;
    console.log(`${user} connected`);
    client.broadcast.emit('new message', {username: '관리자', message: `${user}님이 입장하셨습니다.`});
    
    client.on('new message', (message) => {
      // console.log(`${user} : ${message}`); <<서버에서 유저 : 메시지 둘 다 출력
        console.log(message); // << 클라이언트에서 메시지 데이터에 유저 정보도 가져오는 경우
        io.emit('new message', message);
    })
    
    client.on('disconnect', () => {
        console.log(`${user} disconnected`);
        io.emit('new message', {username: '관리자', message: `${user}님이 퇴장하셨습니다.`});
    });
});
    
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/ message", (_, res) => {
  res.send("message from server");
});


ViteExpress.bind(app, server);