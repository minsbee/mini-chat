import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { io } from "socket.io-client"

function App() {
  const [count, setCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  
  
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
    
    const onConnected = () => {
        console.log("front - connected to socket");
        setIsConnected(true);
    };
    
    const disconnectToSocket = () => {
        console.log("disconnect to socket");
        socket?.disconnect();
        setSocket(null);
    };
    
    const onDisconnected = () => {
        console.log("front - disconnected to socket");
        setIsConnected(false);
    }

    useEffect(() => {
        console.log('useEffect called!');
        socket?.on('connect', onConnected);
        socket?.on('disconnect', onDisconnected);
        
        return () => {
            console.log('useEffect cleanup function called!');
            socket?.off('connect', onConnected);
            socket?.off('disconnect', onDisconnected);

        }
    }, [socket]);
    
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
        <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
            </button>
        </div>
        <div className="card">
            <h2>사용자 : {username}</h2>
             <h3>{isConnected ? `"${username}" 님이 접속하셨습니다.` : `미접속`}</h3>
            <input type="text" value={username} onChange={handleUsernameChange} />

          <button onClick={connectToSocket}>접속
          </button>
          <button onClick={disconnectToSocket}>접속 종료
          </button>
        </div>
        <p className="read-the-docs">
            Click on the Vite and React logos to learn more
        </p>
    </>
  )
}

export default App
