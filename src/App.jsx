import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { io } from "socket.io-client"

function App() {
  const [count, setCount] = useState(0);
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
    
    const disconnectToSocket = () => {
        console.log("disconnect to socket");
        socket?.disconnect();
        setSocket(!socket);
    };

    useEffect(() => {
        if (socket) {
            socket.on("connect", () => {
                console.log("connected to server");
            });
            socket.on("disconnect", () => {
                console.log("disconnected from server");
            });
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
            <p>
                Edit <code>src/App.jsx</code> and save to test HMR
            </p>
        </div>
        <div className="card">
            <h2>사용자 : {username}</h2>
            <input type="text" value={username} onChange={handleUsernameChange} placeholder="Type username here" />

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
