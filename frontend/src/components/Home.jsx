import React from 'react'
import { Link } from 'react-router-dom'
import { Switch } from "@/components/ui/switch"


function Home() {
  const username = localStorage.getItem('username')

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
     

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Syncing up <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-300">People</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Connect, collaborate, and communicate seamlessly with SYNC
          </p>
          {username ? (
            <Link
              to="/chat-rooms"
              className="px-8 py-3 text-lg font-medium text-white bg-purple-600 rounded-full hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              Start Chatting
            </Link>
          ) : (
            <Link
              to="/signup"
              className="px-8 py-3 text-lg font-medium text-white bg-purple-600 rounded-full hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              Start Chatting
            </Link>
            
          )}
        </div>
        
      </main>
      {/* <div><Switch /></div> */}

      {/* <div><Link
              to="/chat-dashboard"
              className="px-8 py-3 text-lg font-medium text-white bg-purple-600 rounded-full hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              Dashboard
            </Link></div> */}
      <footer className="w-full p-4 bg-gray-800">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; SYNC. WDP MAJOR PROJECT.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home