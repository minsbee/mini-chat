import {useEffect, useState} from 'react'
import './App.css'
import { io } from "socket.io-client"

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  
  
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    };
  
    const connectToSocket = () => {
        console.log("connecting to socket");
        const _socket = io("http://localhost:3000", {
            autoConnect: false,
            query: {username},
        });
        _socket.connect();
        setSocket(_socket);
    };

    const disconnectToSocket = () => {
        console.log("disconnect to socket");
        socket?.disconnect();
        setSocket(null);
    };
    
    const onConnected = () => {
        console.log("front - connected to socket");
        setIsConnected(true);
    };

    const onDisconnected = () => {
        console.log("front - disconnected to socket");
        setIsConnected(false);
    }
    
    const onMessageReceive = (data) => {
        console.log(`front - message received`);
        console.log(data);
        setMessages((messages) => [...messages, data]);
    }
    
    const handleMessageChange = (e) => {
        setUserInput(e.target.value);
    }
    
    const handleSendMessage = () => {
        console.log(`front - send message: ${userInput}`);
        socket?.emit("new message", {username: username, message: userInput}, (res) => {
            console.log(res);
        });
    }
    
    const messageList = messages.map((message, index) => {
        return (
            <li key={index}>
                {message.username} : {message.message}
            </li>
        );
    });

    useEffect(() => {
        console.log("scroll to bottom");
        document.getElementById('chat-list').scrollTo({left: 0, top: document.body.scrollHeight, behavior: "smooth"});
    }, [messages]);

    useEffect(() => {
        console.log('useEffect called!');
        socket?.on('connect', onConnected);
        socket?.on('new message', onMessageReceive);
        socket?.on('disconnect', onDisconnected);
        
        return () => {
            console.log('useEffect cleanup function called!');
            socket?.off('connect', onConnected);
            socket?.off('new message', onMessageReceive);
            socket?.off('disconnect', onDisconnected);

        }
    }, [socket]);
    
  return (
      <main>
          <div id='nav-bar'>
              <h2>사용자 : {username}</h2>
              <h3>{isConnected ? `"${username}" 님이 접속하셨습니다.` : `미접속`}</h3>
              <input type="text" value={username} onChange={handleUsernameChange}/>

              <button onClick={connectToSocket}>접속
              </button>
              <button onClick={disconnectToSocket}>접속 종료
              </button>
          </div>
          <ul id="chat-list">
              {messageList}
          </ul>
        <div id='message-input'>
          <input type="text" value={userInput} onChange={handleMessageChange} />
          <button onClick={handleSendMessage}>전송
          </button>
        </div>
      </main>
  )
}

export default App
