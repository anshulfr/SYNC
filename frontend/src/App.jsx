import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Signup from './components/Signup'
import Login from './components/Login'
import ChatRoomList from './components/ChatRoomList'
import ChatRoom from './components/ChatRoom'
import JoinChatRoom from './components/JoinChatRoom'
import Header from './components/Header'
import ChatDashboard from './components/ChatDashboard'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const location = useLocation()
  const chatRoomName = location.state?.chatRoomName || 'Chat Application'

  return (
    <div className="App">
      <Header />
      
      <div style={{ overflow: 'hidden', height: '100vh' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat-rooms" element={<ChatRoomList />} />
        <Route path="/chat-room/:id" element={<ChatRoom />} />
        <Route path="/join/:joinLink" element={<JoinChatRoom />} />
        
      </Routes>
      </div>
      <ToastContainer />
    </div>
  )
}

export default App